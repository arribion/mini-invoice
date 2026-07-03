import { Upload } from "lucide-react";

const TaskLogExcelUpload = () => {
  return (
    <article className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Upload Task Log ( Excel )
      </h1>

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
          />
        </label>

        <button
          type="submit"
          className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg font-semibold transition-colors">
          Upload
        </button>
      </form>
    </article>
  );
};

export default TaskLogExcelUpload;