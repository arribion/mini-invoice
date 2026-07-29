import multer from "multer";

const storage = multer.memoryStorage();

const filter_files = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    // PDF
    "application/pdf",
    // Video
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-matroska",
    // Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Audio
    "audio/mpeg", // MP3
    "audio/wav", // WAV
    "audio/ogg", // OGG
    "audio/aac", // AAC
    "audio/mp4", // MP4 audio
    "audio/webm", // WebM audio
    // ZIP
    "application/zip",
    "application/x-zip-compressed",
  ];

  const isPdfExtension = file.originalname.toLowerCase().endsWith(".pdf");
  const isAllowedMime = allowedMimeTypes.includes(file.mimetype);

  // Also allow octet-stream for PDFs (common fallback) and other known fallbacks
  const isOctetStreamPdf =
    file.mimetype === "application/octet-stream" && isPdfExtension;

  if (isAllowedMime || isOctetStreamPdf) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid File type (${file.mimetype}). Allowed: Images, PDF, Videos, Audio, Word documents, ZIP archives.`,
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter: filter_files,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

export default upload;