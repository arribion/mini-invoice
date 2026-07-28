import cloudinary from "../../config/cloudinary.js";
import streamUpload from "../../utils/cloudinary.upload.js";
import { ResourceModel } from "../../models/resource.model.js";
import path from "path";

// Helper to detect resource type (image, video, raw)
const detectResourceType = (file) => {
  const mimetype = file.mimetype;
  const ext = path.extname(file.originalname).toLowerCase();

  // Check by MIME type first
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";

  // Then fallback to extension for common video formats
  const videoExtensions = [
    ".mp4",
    ".mov",
    ".mkv",
    ".webm",
    ".avi",
    ".mpeg",
    ".mpg",
    ".3gp",
  ];
  if (videoExtensions.includes(ext)) return "video";

  // PDF, Word, etc.
  if (
    mimetype === "application/pdf" ||
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    (mimetype === "application/octet-stream" && ext === ".pdf")
  ) {
    return "raw";
  }

  // Default to raw
  return "raw";
};

// Helper to determine Cloudinary resource_type
const getCloudinaryResourceType = (file) => {
  const type = detectResourceType(file);
  if (type === "image") return "image";
  if (type === "video") return "video";
  return "raw";
};

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

    // Determine the correct Cloudinary resource type
    const cldResourceType = getCloudinaryResourceType(file);
    const uploadResult = await streamUpload(file, cldResourceType);

    // Determine DB resource type
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
        type: dbResourceType, // ✅ now included in the response
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

export const deleteResource = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing resource id" });
  }

  try {
    const resource = await ResourceModel.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    let cldResourceType = "raw";
    if (resource.type === "image") cldResourceType = "image";
    else if (resource.type === "video") cldResourceType = "video";

    const result = await cloudinary.uploader.destroy(resource.publicId, {
      resource_type: cldResourceType,
      invalidate: true,
    });

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
