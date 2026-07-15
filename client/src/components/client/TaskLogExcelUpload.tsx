import { useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet } from "lucide-react";
// Import the separated Preview component from the same directory level
import ExcelPreview from "./ExcelPreview";

const TaskLogExcelUpload = () => {
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    // Process stream buffers to handle binary XML workbooks properly (.xlsx)
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          setError("Failed to read file content.");
          return;
        }
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Target the active workbook tracking sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Transform the structured sheet matrix into standard json structures
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (parsedData.length === 0) {
          setError("The selected file contains no data rows.");
          return;
        }

        setPreviewData(parsedData);
      } catch (err) {
        setError(
          "Failed to parse file. Ensure it is a valid Excel workbook sheet or CSV file.",
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveData = async () => {
    setIsSaving(true);
    setError("");

    // Read custom host environment paths safely
    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const endpoint = `${cleanBaseUrl}/api/v1/excel/upload`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileName,
          tasks: previewData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }

      alert("Data saved successfully!");
      handleReset();
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Network error. Failed to save logs to the server.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreviewData(null);
    setFileName("");
    setError("");
    setIsSaving(false);
  };

  return (
    /* Changed max-w-xl to w-full max-w-[95vw] to allow full stretch expansion */
    <article className="w-full max-w-[75vw] mx-auto p-4 transition-all duration-300">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Upload Task Log
      </h1>

      {!previewData ? (
        /* Isolated inner container keeps file selector entry clean and centered */
        <div className="max-w-xl mx-auto">
          <form className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <Upload className="w-8 h-8 text-sky-500 mb-4" />
            <p className="text-slate-600 text-sm mb-2">
              Drag & drop your file here, or
            </p>
            <label className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Choose File
              <input
                type="file"
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </label>
            {error && (
              <p className="text-rose-500 text-xs mt-3 text-center">{error}</p>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-full border border-sky-100 text-sky-700 text-xs font-medium mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {fileName}
          </div>
          {error && (
            <p className="text-rose-500 text-xs mt-1 mb-3 text-center">
              {error}
            </p>
          )}
          <ExcelPreview
            data={previewData}
            onCancel={handleReset}
            onSave={handleSaveData}
            isSaving={isSaving}
          />
        </div>
      )}
    </article>
  );
};

export default TaskLogExcelUpload;