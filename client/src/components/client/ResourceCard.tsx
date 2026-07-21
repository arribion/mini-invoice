import React from "react";
import { Download, ExternalLink, FileText } from "lucide-react";

export type Resource = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
  title?: string;
  description?: string;
  version?: string;
};

type Props = {
  resource: Resource;
};

const ResourceCard: React.FC<Props> = ({ resource }) => {
  // Safe validation guards checking both type string and URL extensions
  const isImage =
    resource.type === "image" ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(resource.url);
  const isVideo =
    resource.type === "video" ||
    /\.(mp4|mov|avi|webm|mkv)$/i.test(resource.url);
  const isPdf = resource.type === "pdf" || /\.pdf$/i.test(resource.url);

  return (
    <article className=" w-full gap-4 rounded-lg border border-gray-200 bg-slate-200 shadow-sm transition hover:shadow-md">
      {/* Compact Preview (minimized) */}
      <div className="shrink-0 h-20 w- 8 overflow-hidden rounded-t-lg bg-gray-300 border-r border-gray-200 flex items-center justify-center">
        {isImage && (
          <img
            src={resource.url || "https://placehold.net/400x400.png"}
            alt={resource.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}

        {isVideo && (
          <video
            src={resource.url}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        )}

        {isPdf && (
          <div className="flex flex-col items-center justify-center text-red-500">
            <FileText size={28} />
            <span className="mt-1 text-[10px] font-semibold">PDF</span>
          </div>
        )}

        {!isImage && !isVideo && !isPdf && (
          <div className="flex items-center justify-center">
            <FileText size={28} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Compact Content */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900">
              {resource.title ?? resource.name}
            </h4>

            <p className="mt-1 truncate text-xs text-gray-500">
              {resource.description ?? "No description provided"}
            </p>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-medium text-gray-600">
              {resource.version ?? "v—"}
            </span>
            <span className="mt-1 text-[11px] text-gray-400">
              {resource.size}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            <time dateTime={resource.uploadedAt}>
              {new Date(resource.uploadedAt).toLocaleDateString()}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${resource.name}`}
              className="inline-flex items-center gap-2 rounded px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200">
              <ExternalLink size={14} /> View
            </a>

            <a
              href={resource.url}
              target="_blank"
              download
              aria-label={`Download ${resource.name}`}
              className="inline-flex items-center gap-2 rounded bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-700">
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResourceCard;