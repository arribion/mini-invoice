// // middleware/Upload.check.file.js

// export const check_uploaded_files = (err, req, res, next) => {
//   // If a Multer specific field/file error happens
//   if (err && err.name === "MulterError") {
//     return res.status(400).json({
//       success: false,
//       code: err.code,
//       message: `Multer upload error: ${err.message}. Ensure your form-data key is named exactly 'file'.`,
//     });
//   }
// // 
//   // If our custom array filter throws an file validation error
//   if (err instanceof Error) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }

//   // Fallback catch-all for remaining runtime issues
//   return res.status(500).json({
//     success: false,
//     message: err?.message || "An unknown file processing error occurred.",
//   });
// };
