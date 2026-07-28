import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import path from "path";

const streamUpload = (file, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const publicId = `user_uploads/${baseName}-${uniqueSuffix}${ext}`;

    const uploadOptions = {
      public_id: publicId,
      resource_type: resourceType,
      flags: "attachment",
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (result) return resolve(result);
        return reject(error);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default streamUpload;