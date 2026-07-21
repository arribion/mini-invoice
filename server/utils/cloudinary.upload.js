// server/utils/cloudinary.upload.js
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "user_uploads",
        use_filename: true,
        unique_filename: true,
        resource_type: "auto",
      },
      (error, result) => {
        if (result) return resolve(result);
        return reject(error);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default streamUpload;
