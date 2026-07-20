import React, { useCallback, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  cloudinaryUrl?: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

if (!BASE_URL) {
  console.error("VITE_BASE_URL is not defined. Resource uploads will fail.");
}

const ResourcesUploadForm: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isUploadingAny, setIsUploadingAny] = useState(false);

  const uploadSingleFile = useCallback(async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/resources/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? file.size;
            const percentage = Math.round((progressEvent.loaded * 100) / total);

            setResources((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, progress: percentage } : item,
              ),
            );
          },
        },
      );

      if (response?.data?.success) {
        setResources((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "success",
                  progress: 100,
                  cloudinaryUrl: response.data.url,
                }
              : item,
          ),
        );
      } else {
        // Treat non-success response as error
        setResources((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "error" } : item,
          ),
        );
        console.error(
          "Upload response did not indicate success:",
          response?.data,
        );
      }
    } catch (err) {
      console.error(`Upload failed for ${file.name}:`, err);
      setResources((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "error" } : item,
        ),
      );
    }
  }, []);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const uploadedFiles = Array.from(files);

      const newResources: Resource[] = uploadedFiles.map((file) => ({
        id: crypto?.randomUUID?.() ?? `${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type || "Unknown",
        size: formatBytes(file.size),
        uploadedAt: new Date().toLocaleString(),
        file,
        status: "uploading",
        progress: 0,
      }));

      // Append new resources to the end (older first, newest last)
      setResources((prev) => [...prev, ...newResources]);

      // Reset input so same file can be selected again if needed
      e.target.value = "";

      if (!BASE_URL) {
        // Mark all as error immediately if no base URL
        setResources((prev) =>
          prev.map((r) =>
            newResources.some((n) => n.id === r.id)
              ? { ...r, status: "error" }
              : r,
          ),
        );
        console.error("Cannot upload: BASE_URL is not configured.");
        return;
      }

      setIsUploadingAny(true);

      // Upload all files in parallel
      await Promise.all(
        newResources.map(async (resource) => {
          await uploadSingleFile(resource.id, resource.file);
        }),
      );

      setIsUploadingAny(false);
    },
    [uploadSingleFile],
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-labelledby="resource-form-title">
      <h1 id="resource-form-title" className="text-lg font-semibold mb-4">
        RESOURCE FORM
      </h1>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="resource-title"
            className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="resource-title"
            name="title"
            type="text"
            placeholder="project vox instruction"
            className="border p-2 w-full rounded mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="resource-desc"
            className="block text-sm font-medium text-gray-700">
            Description / Note
          </label>
          <input
            id="resource-desc"
            name="description"
            type="text"
            placeholder="Review by before 1/1/2030"
            className="border p-2 w-full rounded mt-1"
          />
        </div>

        <div>
          <div className="bg-red-100 rounded border-2 border-red-400 p-3 mb-3">
            <p className="text-sm text-gray-700">
              <strong>NOTE YOU CAN ONLY UPLOAD:</strong> images, PDFs, videos,
              and MS Word documents
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              hidden
              multiple
              type="file"
              accept="image/*,application/pdf,video/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleUpload}
              aria-hidden
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingAny}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-medium text-white transition hover:bg-sky-600 disabled:opacity-60">
              <Upload size={18} />
              Upload
            </button>

            {isUploadingAny && (
              <span className="text-sm text-gray-500">Uploading files…</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  File
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Size
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No resource Upload Preview.
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id} className="border-t">
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
                              className="font-semibold text-[10px] text-green-700 underline hover:text-green-800">
                              {resource.name}
                            </a>
                          ) : (
                            <p className="font-semibold text-[10px] text-gray-900">
                              {resource.name}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Downloadable Resource
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-[10px] text-gray-600">
                      {resource.type}
                    </td>
                    <td className="px-6 py-5 text-[6px] text-gray-600">
                      {resource.size}
                    </td>

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
                        <div className="flex text-[10px] items-center gap-1.5 text-green-600 text-sm font-medium">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
};

export default ResourcesUploadForm;