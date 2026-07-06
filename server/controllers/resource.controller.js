import streamUpload from "../utils/cloudinary.upload.js";

export const uploadFile = async (req, res) => {
    const  file  = req.file;
    try {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: error.message
        });
    }
};

export default uploadFile