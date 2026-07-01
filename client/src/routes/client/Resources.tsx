import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  ExternalLink,
  FileDown,
} from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description?: string;
  fileType?: string;
  fileUrl: string;
  createdAt?: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/resources");

      if (Array.isArray(data)) {
        setResources(data);
      } else if (Array.isArray(data?.data)) {
        setResources(data.data);
      } else {
        setResources([]);
      }
    } catch (err) {
      setError("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getFileLabel = (fileType?: string) => {
    if (!fileType) return "File";
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word") || fileType.includes("document"))
      return "DOC";
    if (fileType.includes("image")) return "Image";
    return fileType.toUpperCase();
  };

  return (
    <section className="min-h-[80.8vh] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
       

        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading resources...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex w-fit items-center justify-center rounded-full bg-gray-100 p-4 text-gray-500">
              <FileText size={34} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              No Resources Found
            </h2>
            <p className="mt-2 text-gray-500">
              The admin has not uploaded any files yet.
            </p>
          </div>
        )}

        {!loading && !error && resources.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <FileDown size={26} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-lg font-semibold text-gray-900">
                        {resource.title}
                      </h3>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                        {getFileLabel(resource.fileType)}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {resource.description || "No description provided."}
                    </p>

                    {resource.createdAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        Uploaded{" "}
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
                    <ExternalLink size={16} />
                    View
                  </a>

                  <a
                    href={resource.fileUrl}
                    download
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Resources;
