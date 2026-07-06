import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "user_uploads" }, // organize by folder
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default streamUpload;