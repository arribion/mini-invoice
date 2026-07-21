import  multer from "multer";
import ExcelUploadService from "../../services/excel.upload.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Using memory storage for speed

// Route using the ExcelUploadService
app.post("/upload", upload.single("excelFile"), (req, res) => {
  try {
    // 1. Pass the Multer file object directly to the service
    const parsedData = ExcelUploadService.parseExcel(req.file);

    // 2. Return clean entries to client
    res.status(200).json({
      success: true,
      totalRows: parsedData.length,
      data: parsedData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

