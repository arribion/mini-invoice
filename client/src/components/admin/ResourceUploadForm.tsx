import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

type UploadStatus = "idle" | "staged" | "uploading" | "success" | "error";

interface ResourceItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  file?: File;
  status: UploadStatus;
  progress: number;
  cloudinaryUrl?: string;
  publicId?: string;
  title?: string;
  description?: string;
  version?: string;
  url?: string;
  _id?: string;
}

interface Project {
  _id: string;
  project_name: string;
}

const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "—";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

interface Props {
  defaultProjectId?: string;
  maxFormHeight?: string; // e.g., "80vh"
}

const ResourcesUploadForm: React.FC<Props> = ({ defaultProjectId, maxFormHeight = "80vh" }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(defaultProjectId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isUploadingAny, setIsUploadingAny] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const api = axios.create({
    baseURL: BASE_URL || "",
    headers: { "Content-Type": "application/json" },
  });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!BASE_URL) return;
      setLoadingProjects(true);
      try {
        const res = await api.get("/api/v1/projects");
        const payload = res?.data;
        const list: Project[] = Array.isArray(payload) ? payload : payload?.data ?? [];
        setProjects(list);
        if (!selectedProjectId && list.length > 0) setSelectedProjectId(list[0]._id);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stage files (functional update to avoid stale state)
  const handleSelectFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const arr = Array.from(files).map((file) => ({
        id: crypto?.randomUUID?.() ?? `${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type || "Unknown",
        size: formatBytes(file.size),
        uploadedAt: new Date().toLocaleString(),
        file,
        status: "staged" as UploadStatus,
        progress: 0,
        title,
        description,
        version,
      }));

      setResources((prev) => [...prev, ...arr]);
      e.target.value = "";
    },
    [title, description, version],
  );

  const removeStaged = useCallback((id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Upload single file
  const uploadSingleFile = useCallback(
    async (item: ResourceItem) => {
      if (!item.file) return { success: false };
      if (!BASE_URL) {
        setResources((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: "error" } : r)));
        return { success: false };
      }
      if (!selectedProjectId) {
        setResources((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: "error" } : r)));
        console.error("No project selected for upload.");
        return { success: false };
      }

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("projectID", selectedProjectId);
      formData.append("title", item.title ?? title);
      formData.append("description", item.description ?? description);
      formData.append("version", item.version ?? version);

      try {
        setResources((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: "uploading", progress: 0 } : r)));

        const response = await axios.post(`${BASE_URL}/api/v1/resources/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? item.file!.size;
            const percentage = Math.round((progressEvent.loaded * 100) / total);
            setResources((prev) => prev.map((r) => (r.id === item.id ? { ...r, progress: percentage } : r)));
          },
        });

        const success = response?.data?.success;
        const payload = response?.data?.data ?? response?.data;

        if (success && payload) {
          setResources((prev) =>
            prev.map((r) =>
              r.id === item.id
                ? {
                    ...r,
                    status: "success",
                    progress: 100,
                    cloudinaryUrl: payload.fileUrl ?? payload.url ?? payload.secure_url,
                    publicId: payload.publicId ?? payload.public_id,
                  }
                : r,
            ),
          );
          return { success: true };
        } else {
          setResources((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: "error" } : r)));
          console.error("Upload response did not indicate success:", response?.data);
          return { success: false };
        }
      } catch (err) {
        console.error("Upload failed:", err);
        setResources((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: "error" } : r)));
        return { success: false };
      }
    },
    [selectedProjectId, title, description, version],
  );

  // Robust staged detection
  const hasStaged = resources.some(
    (r) =>
      r.status === "staged" ||
      (r.file && r.status !== "uploading" && r.status !== "success" && r.status !== "error"),
  );

  // Submit handler uploads staged files
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      // Recompute staged at call time to avoid stale reads
      const staged = resources.filter(
        (r) =>
          r.status === "staged" ||
          (r.file && r.status !== "uploading" && r.status !== "success" && r.status !== "error"),
      );

      if (staged.length === 0) {
        alert("No files staged for upload.");
        return;
      }
      if (!selectedProjectId) {
        alert("Please select a project before submitting.");
        return;
      }

      setIsUploadingAny(true);

      // Upload in parallel; consider limiting concurrency if needed
      await Promise.all(staged.map((item) => uploadSingleFile(item)));

      setIsUploadingAny(false);
    },
    [resources, selectedProjectId, uploadSingleFile],
  );

  // Fetch existing resources for selected project and merge (optional)
  const fetchProjectResources = useCallback(
    async (projectId?: string) => {
      if (!projectId || !BASE_URL) return;
      try {
        const res = await api.get(`/api/v1/resources/get?projectID=${projectId}`);
        const payload = res?.data;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        const mapped = list.map((r: any) => ({
          id: r._id ?? r.publicId ?? String(Math.random()),
          name: r.title ?? (r.fileUrl ? r.fileUrl.split("/").pop() : "resource"),
          type: r.type ?? "file",
          size: r.size ? formatBytes(r.size) : "—",
          uploadedAt: r.createdAt ?? new Date().toISOString(),
          status: "success" as UploadStatus,
          progress: 100,
          cloudinaryUrl: r.fileUrl ?? r.url ?? r.secure_url,
          publicId: r.publicId,
          title: r.title,
          description: r.description,
          version: r.version,
          url: r.fileUrl ?? r.url ?? r.secure_url,
          _id: r._id,
        }));
        setResources((prev) => {
          const staged = prev.filter((p) => p.status !== "success");
          return [...staged, ...mapped];
        });
      } catch (err) {
        console.error("Failed to fetch project resources:", err);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedProjectId) fetchProjectResources(selectedProjectId);
  }, [selectedProjectId, fetchProjectResources]);

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="resource-form-title"
      style={{ maxHeight: maxFormHeight }}
      className="overflow-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h1 id="resource-form-title" className="text-lg font-semibold mb-4">
        RESOURCE FORM
      </h1>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="project-select"
            className="block text-sm font-medium text-gray-700">
            Select a project
          </label>
          <div className="mt-1">
            {loadingProjects ? (
              <div className="text-sm text-gray-500">Loading projects…</div>
            ) : (
              <select
                id="project-select"
                value={selectedProjectId ?? ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="border p-2 w-full rounded">
                <option value="" disabled>
                  Select a project
                </option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="resource-version"
            className="block text-sm font-medium text-gray-700">
            Version
          </label>
          <input
            id="resource-version"
            name="version"
            type="text"
            placeholder="v1.0"
            className="border p-2 w-full rounded mt-1"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>

        <div>
          <div className="bg-red-100 rounded border border-red-200 p-3 mb-3">
            <p className=" text-sm text-gray-700">
              <strong>UPLOAD ONLY:</strong> Images, PDFs, videos, and MS Word
              documents
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              hidden
              multiple
              type="file"
              accept="image/*,application/pdf,video/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleSelectFiles}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingAny}
              className="inline-flex items-center gap-2 rounded w-full border px-5 py-3 font-medium text-slate-700 bg-slate-200 transition hover:bg-slate-100 disabled:opacity-60">
              <Upload size={18} />
              Select Files
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
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Size
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
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
                          {resource.cloudinaryUrl || resource.url ? (
                            <a
                              href={resource.cloudinaryUrl ?? resource.url}
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
                            {resource.title ?? "No title provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {resource.status === "staged" && (
                        <div className="text-xs text-green-700">Staged</div>
                      )}

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

                    <td className="px-6 py-5 text-[10px] text-gray-600">
                      {resource.type}
                    </td>
                    <td className="px-6 py-5 text-[10px] text-gray-600">
                      {resource.size}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        {resource.status === "staged" && (
                          <button
                            type="button"
                            onClick={() => removeStaged(resource.id)}
                            className="text-sm text-red-600 underline">
                            Remove
                          </button>
                        )}
                        {resource.status === "success" &&
                          resource.cloudinaryUrl && (
                            <a
                              href={resource.cloudinaryUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-sky-600 underline">
                              View
                            </a>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          disabled={isUploadingAny || !hasStaged}
          className="inline-flex w-full items-center gap-2 rounded bg-sky-500 px-5 py-3 font-medium text-white transition hover:bg-sky-700 disabled:opacity-60">
          {isUploadingAny ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Uploading
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default ResourcesUploadForm;
