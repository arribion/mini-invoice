import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  file: File;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const ManageResources = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [resources, setResources] = useState<Resource[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const uploadedFiles = Array.from(e.target.files);

    const newResources = uploadedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "Unknown",
      size: formatBytes(file.size),
      uploadedAt: new Date().toLocaleDateString(),
      file,
    }));

    setResources((prev) => [...newResources, ...prev]);

    e.target.value = "";
  };

  const deleteFile = (id: string) => {
    setResources((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Resources</h1>

        <p className="mt-2 text-gray-600">
          Upload documents and manage downloadable resources.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Resource Library</h2>

            <p className="text-sm text-gray-500">
              Upload PDFs, Word documents, ZIP files and more.
            </p>
          </div>

          <div>
            <input
              ref={inputRef}
              hidden
              multiple
              type="file"
              onChange={handleUpload}
            />

            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700">
              <Upload size={18} />
              Upload Files
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  File
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Size
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Uploaded
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No resources uploaded yet.
                  </td>
                </tr>
              )}

              {resources.map((resource) => (
                <tr key={resource.id} className="transition hover:bg-green-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-green-100 p-3">
                        <FileText className="text-green-600" size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {resource.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Downloadable Resource
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{resource.type}</td>

                  <td className="px-6 py-5 text-gray-600">{resource.size}</td>

                  <td className="px-6 py-5 text-gray-600">
                    {resource.uploadedAt}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => deleteFile(resource.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100">
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageResources;
