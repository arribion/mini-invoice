import { Upload } from 'lucide-react';

const TaskLogExcelUpload = () => {
  return (
    <article>
      <h1 className="text-xl font-bold text-slate-900">
        Upload Task Log (CSV/Excel)
      </h1>
      <form className="border-2 border-dashed p-4 rounded-xl flex justify-center">
        <div>
          <Upload className="w-10 h-10 text-slate-500" />
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <button
            type="submit"
            className="text-slate-700">
            Upload
          </button>
        </div>
      </form>
    </article>
  );
}

export default TaskLogExcelUpload