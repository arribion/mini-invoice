import React from "react";
import {
  Download,
  ExternalLink,
//   Image as ImageIcon,
//   Video,
  FileText,
} from "lucide-react";

export type Resource = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
};

type Props = {
  resource: Resource;
};

const ResourceCard: React.FC<Props> = ({ resource }) => {
  const isImage =
    resource.type === "image" ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(resource.url);

  const isVideo =
    resource.type === "video" ||
    /\.(mp4|mov|avi|webm|mkv)$/i.test(resource.url);

  const isPdf = resource.type === "pdf" || /\.pdf$/i.test(resource.url);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Preview */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        {isImage && (
          <img
            src={resource.url}
            alt={resource.name}
            className="h-full w-full object-cover"
          />
        )}

        {isVideo && (
          <video
            src={resource.url}
            controls
            className="h-full w-full object-cover"
          />
        )}

        {isPdf && (
          <iframe
            src={`${resource.url}#toolbar=0`}
            title={resource.name}
            className="h-full w-full"
          />
        )}

        {!isImage && !isVideo && !isPdf && (
          <div className="flex h-full items-center justify-center">
            <FileText size={70} className="text-gray-400" />
          </div>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase shadow">
          {resource.type}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div>
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {resource.name}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <span>{resource.size}</span>
            <span>•</span>
            <span>{resource.uploadedAt}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 px-4 py-1 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
            <ExternalLink size={18} />
            View
          </a>

          <a
            href={resource.url}
            download
            className="flex flex-1 items-center justify-center gap-2 rounded bg-sky-600 px-4 py-1 text-sm font-semibold text-white transition hover:bg-red-700">
            <Download size={18} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;