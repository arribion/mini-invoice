import { useRef, useState } from "react";
import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import ResourceTable from "../../components/admin/ResourceTable";

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  file: File;
  status: "idle" | "uploading" | "success" | "error"; // Tracks file progress
  progress: number; // Percentage 0-100
  cloudinaryUrl?: string; // Stored link from backend
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
  console.log("Error accessing resource upload base url...")
}

const ResourcesUploadForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  // Function to send a single file via Axios
  const uploadSingleFile = async (id: string, file: File) => {
    const formData = new FormData();
    // The key name MUST be "file" to match upload.single("file") or your multer field config
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/resources/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Optional tracking of progress percentage
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || file.size;
            const percentage = Math.round((progressEvent.loaded * 100) / total);

            setResources((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, progress: percentage } : item,
              ),
            );
          },
        },
      );

      // Backend returns success, update status and store URL
      if (response.data.success) {
        setResources((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: "success", cloudinaryUrl: response.data.url }
              : item,
          ),
        );
      }
    } catch (error: any) {
      console.error(`Upload failed for ${file.name}:`, error);
      setResources((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "error" } : item,
        ),
      );
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const uploadedFiles = Array.from(e.target.files);

    // 1. Create fresh state instances for the UI layout
    const newResources: Resource[] = uploadedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "Unknown",
      size: formatBytes(file.size),
      uploadedAt: new Date().toLocaleDateString(),
      file,
      status: "uploading",
      progress: 0,
    }));

    // Add them to state instantly so loaders display
    setResources((prev) => [...newResources, ...prev]);
    e.target.value = ""; // Reset input field

    // 2. Fire off HTTP requests for all selected files simultaneously
    await Promise.all(
      newResources.map((resource) =>
        uploadSingleFile(resource.id, resource.file),
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1>RESOURCE FORM</h1>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Preview</h2>
            <p className="text-sm text-gray-500">
              <b>NOTE YOU CAN ONLY UPLOAD:</b> images, pdf's, videos, and
              msword",
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
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-medium text-white transition hover:bg-sky-600">
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
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {resources.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No resource Upload Preview.
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
                        {resource.cloudinaryUrl ? (
                          <a
                            href={resource.cloudinaryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-green-700 underline hover:text-green-800">
                            {resource.name}
                          </a>
                        ) : (
                          <p className="font-semibold text-gray-900">
                            {resource.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Downloadable Resource
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{resource.type}</td>
                  <td className="px-6 py-5 text-gray-600">{resource.size}</td>

                  {/* Dynamic Status / Progress Bar Column */}
                  <td className="px-6 py-5 text-gray-600">
                    {resource.status === "uploading" && (
                      <div className="flex items-center gap-2">
                        <Loader2
                          className="animate-spin text-green-600"
                          size={16}
                        />
                        <span className="text-xs font-medium text-gray-500">
                          {resource.progress}%
                        </span>
                      </div>
                    )}
                    {resource.status === "success" && (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle size={16} /> Ready
                      </div>
                    )}
                    {resource.status === "error" && (
                      <div className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                        <AlertCircle size={16} /> Failed
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <ResourceTable />
      </div>
    </div>
  );
};

export default ResourcesUploadForm;