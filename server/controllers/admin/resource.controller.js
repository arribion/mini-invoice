import cloudinary from "../../config/cloudinary.js";
import streamUpload from "../../utils/cloudinary.upload.js";

export const uploadResource = async (req, res) => {
  const file = req.file;
  const { title, description } = req.body;
  try {
    // if (!title || !description) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Title and description is required",
    //   });
    // }
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    // Upload the buffer stream to Cloudinary
    const uploadResult = await streamUpload(req.file);
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
};

export const getResources = async (req, res) => {
  try {
    // Query Cloudinary for files inside your specific folder
    const { resources } = await cloudinary.search
      .expression("folder:user_uploads")
      .sort_by("created_at", "desc") // Get newest files first
      .max_results(30) // Limit the results per request
      .execute();

    // Map the complex Cloudinary response to clean, usable objects for your frontend
    const formattedFiles = resources.map((asset) => ({
      id: asset.public_id,
      name: asset.filename || asset.public_id.split("/").pop(), // Extract file name
      type: asset.resource_type === "raw" ? asset.format : asset.resource_type,
      size: `${(asset.bytes / (1024 * 1024)).toFixed(2)} MB`, // Convert bytes to MB
      uploadedAt: new Date(asset.created_at).toLocaleDateString(),
      url: asset.secure_url,
    }));

    return res.status(200).json({
      success: true,
      count: formattedFiles.length,
      data: formattedFiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving files from Cloudinary",
      error: error.message,
    });
  }
};

export const deleteResource = async (req, res) => {
  const { publicId, resourceType } = req.params;

  // 1. Validate incoming payload
  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: "Missing publicId in request body.",
    });
  }

  try {
    // 2. Map file types cleanly to what Cloudinary expects
    // Images/Videos map directly, but PDFs/Word Docs must be classified as "raw"
    let cldResourceType = "image";

    if (resourceType === "video" || resourceType?.startsWith("video/")) {
      cldResourceType = "video";
    } else if (
      resourceType === "raw" ||
      resourceType === "pdf" ||
      resourceType?.includes("pdf") ||
      resourceType?.includes("document") ||
      resourceType?.includes("msword")
    ) {
      cldResourceType = "raw";
    }

    // 3. Execute the deletion on Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: cldResourceType,
      invalidate: true, // Clears the file from Cloudinary's global CDN cache instantly
    });

    // 4. Handle edge case where publicId was completely wrong or missing
    if (result.result === "not_found") {
      return res.status(404).json({
        success: false,
        message:
          "Resource not found on Cloudinary. It may have already been deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully from Cloudinary.",
      cloudResult: result,
    });
  } catch (error) {
    // Also fixed the generic copy-paste "Error uploading file" typo message here
    return res.status(500).json({
      success: false,
      message: "Error deleting file from Cloudinary",
      error: error.message,
    });
  }
};

export default {
  uploadResource,
  getResources,
  deleteResource,
};
