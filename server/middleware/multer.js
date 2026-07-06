import multer from "multer";
const storage = multer.memoryStorage();

const filter_files = (req, file, cb) => {
  console.log("Incoming file MIME type:", file.mimetype);
  console.log("Incoming file Name:", file.originalname);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-matroska",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // 2. Add a fallback check for OS-specific mislabeling
  const isPdfExtension = file.originalname.toLowerCase().endsWith(".pdf");
  const isAllowedMime = allowedMimeTypes.includes(file.mimetype);

  if (
    isAllowedMime ||
    (file.mimetype === "application/octet-stream" && isPdfExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid File type (${file.mimetype}). Only Images, PDF, videos, and Word files are allowed.`,
      ),
      false,
    );
  }
};


const upload = multer(
    {
        storage,
        fileFilter: filter_files,
        limits: { fileSize: 20 * 1024 * 1024 }, // Limit to 20MB
    });

export default upload;