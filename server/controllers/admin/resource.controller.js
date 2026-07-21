// server/controllers/admin/resource.controller.js
import cloudinary from "../../config/cloudinary.js";
import streamUpload from "../../utils/cloudinary.upload.js";
import { ResourceModel } from "../../models/resource.model.js";

// Upload resource, save DB record and return Cloudinary URL and publicId
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

    const uploadResult = await streamUpload(file);

    let resourceType = "raw";
    if (file.mimetype.startsWith("image/")) resourceType = "image";
    else if (file.mimetype.startsWith("video/")) resourceType = "video";

    const resource = await ResourceModel.create({
      projectID,
      title,
      description,
      type: resourceType,
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
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error uploading resource",
        error: error.message,
      });
  }
};

// Get resources for a project or all resources if no projectID provided
export const getResources = async (req, res) => {
  const { projectID } = req.query;

  try {
    const filter = projectID ? { projectID } : {};
    const resources = await ResourceModel.find(filter).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving resources",
        error: error.message,
      });
  }
};

// Delete resource by MongoDB id. Removes Cloudinary file using stored publicId then deletes DB doc
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

    // Determine Cloudinary resource_type for destroy
    let cldResourceType = "raw";
    if (resource.type === "image") cldResourceType = "image";
    else if (resource.type === "video") cldResourceType = "video";

    const result = await cloudinary.uploader.destroy(resource.publicId, {
      resource_type: cldResourceType,
      invalidate: true,
    });

    // If cloudinary reports not_found, still remove DB record to avoid orphaned DB entries
    await resource.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Resource deleted",
      cloudResult: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
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
