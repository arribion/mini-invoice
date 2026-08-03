import cloudinary from "../../config/cloudinary.js";
import streamUpload from "../../utils/cloudinary.upload.js";
import { ResourceModel } from "../../models/resource.model.js";
import path from "path";

// ----------------------------
// Helper: Detect resource type from file
// ----------------------------
const detectResourceType = (file) => {
  const mimetype = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();

  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";

  const videoExtensions = [
    ".mp4",
    ".mov",
    ".mkv",
    ".webm",
    ".avi",
    ".mpeg",
    ".mpg",
    ".3gp",
    ".flv",
    ".wmv",
  ];
  if (videoExtensions.includes(ext)) return "video";

  // PDF / Word / raw
  if (
    mimetype === "application/pdf" ||
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    (mimetype === "application/octet-stream" && ext === ".pdf")
  ) {
    return "raw";
  }

  return "raw";
};

// Helper to get Cloudinary resource_type
const getCloudinaryResourceType = (file) => {
  const type = detectResourceType(file);
  if (type === "image") return "image";
  if (type === "video") return "video";
  return "raw";
};

// ----------------------------
// Upload resource
// ----------------------------
export const uploadResource = async (req, res) => {
  const file = req.file;
  const { projectID, title, description, version } = req.body;

  try {
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    if (!projectID || !title || !description || !version) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: projectID, title, description, version",
      });
    }

    const cldResourceType = getCloudinaryResourceType(file);
    const uploadResult = await streamUpload(file, cldResourceType);

    const dbResourceType = detectResourceType(file);

    const resource = await ResourceModel.create({
      projectID,
      title,
      description,
      type: dbResourceType,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      version,
    });

    return res.status(201).json({
      success: true,
      message: "Resource uploaded and saved",
      data: {
        resourceId: resource._id,
        fileUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        type: dbResourceType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading resource",
      error: error.message,
    });
  }
};

// ----------------------------
// Get resources (with optional project filter)
// ----------------------------
export const getResources = async (req, res) => {
  const { projectID } = req.query;

  try {
    const filter = projectID ? { projectID } : {};
    const resources = await ResourceModel.find(filter).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving resources",
      error: error.message,
    });
  }
};

// ----------------------------
// Delete resource (by MongoDB _id or publicId fallback)
// ----------------------------
export const deleteResource = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing resource id" });
  }

  try {
    // 1. Find resource – first by _id, then by publicId (fallback)
    let resource = await ResourceModel.findById(id);
    if (!resource) {
      resource = await ResourceModel.findOne({ publicId: id });
    }

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    // 2. Determine publicId – use stored field, or extract from fileUrl
    let publicId = resource.publicId;
    if (!publicId && resource.fileUrl) {
      // Fallback extraction from Cloudinary URL
      try {
        const url = new URL(resource.fileUrl);
        const pathParts = url.pathname.split("/");
        const uploadIdx = pathParts.indexOf("upload");
        if (uploadIdx !== -1) {
          const parts = pathParts
            .slice(uploadIdx + 1)
            .filter((p) => p && !p.startsWith("v"));
          publicId = parts.join("/");
        }
      } catch (_) {
        // If URL parsing fails, we'll handle below
      }
    }

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Cannot determine publicId for this resource",
      });
    }

    // 3. Determine Cloudinary resource_type
    let cldResourceType = "raw";
    if (resource.type === "image") cldResourceType = "image";
    else if (resource.type === "video") cldResourceType = "video";

    // 4. Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: cldResourceType,
      invalidate: true,
    });

    // 5. Remove from MongoDB
    await resource.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Resource deleted",
      cloudResult: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting resource",
      error: error.message,
    });
  }
};

export default {
  uploadResource,
  getResources,
  deleteResource,
};
