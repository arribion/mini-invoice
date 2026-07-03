import xlsx from "xlsx";
import fs from "fs"

/**
 * Service to process and extract data from an uploaded Excel file.
 */
class ExcelUploadService {
  /**
   * Parses an Excel file into a JSON array.
   * Handles both file paths (disk) and buffers (memory).
   *
   * @param {Object} file - The file object provided by Multer
   * @returns {Array} Array of row objects from the spreadsheet
   */
  static parseExcel(file) {
    if (!file) {
      throw new Error("No file provided for processing.");
    }

    let workbook;

    // Check if file is stored in memory buffer or written to disk
    if (file.buffer) {
      workbook = xlsx.read(file.buffer, { type: "buffer" });
    } else if (file.path) {
      workbook = xlsx.readFile(file.path);
    } else {
      throw new Error("Invalid file format or storage configuration.");
    }

    // Select the first sheet name
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("The uploaded workbook contains no readable sheets.");
    }

    // Convert sheet to JSON array
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false, // Formats values (like currencies) to string matches
      defval: null, // Replaces empty/blank cells with null instead of skipping them
    });

    // Clean up local file asynchronously if it was written to disk
    if (file.path) {
      fs.unlink(file.path, (err) => {
        if (err)
          console.error(`Failed to delete temporary file: ${file.path}`, err);
      });
    }

    return jsonData;
  }
}

export default ExcelUploadService;
