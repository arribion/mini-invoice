import { Edit, Trash2 } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";

type Project = {
  id: string;
  projectName: string;
  platform: string;
  ratePerHour: number;
  status: "ACTIVE" | "PENDING" | "CLOSED";
};

interface Props {
  projects: Project[];
  loading: boolean;
  error: string;
  search: string;
  setSearch: (value: string) => void;
  refresh: () => void;
}

const statusColor = (status: Project["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200/60";
    case "CLOSED":
      return "bg-rose-50 text-rose-700 border-rose-200/60";
  }
};

const ProjectsTable = ({
  projects,
  loading,
  error,
  search,
  setSearch,
  refresh,
}: Props) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Projects
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            View, filter, and manage client development tracks.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-green-700 hover:bg-green-800 disabled:bg-gray-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed">
          <LuRefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Action Sub-Toolbar Layer */}
      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
        <div className="relative max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or platform..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition"
          />
        </div>
      </div>

      {/* Main Responsive Table Presentation Layer */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <th className="p-4 pl-6">Project Details</th>
              <th className="p-4">Platform Channel</th>
              <th className="p-4">Hourly Rate</th>
              <th className="p-4">Current Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {/* Conditional Global Intercept Rows */}
            {loading && projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <LuRefreshCcw
                      className="animate-spin text-gray-400"
                      size={24}
                    />
                    <span>Fetching database indices...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-rose-600 font-medium bg-rose-50/20">
                  {error}
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-gray-400 font-medium">
                  No active project records located.
                </td>
              </tr>
            ) : (
              /* Core Content Stream Loops */
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6 font-semibold text-gray-900">
                    {project.projectName}
                  </td>
                  <td className="p-4 text-gray-500 font-medium">
                    {project.platform}
                  </td>
                  <td className="p-4 text-gray-900 font-medium">
                    KES {project.ratePerHour.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition">
                        <Edit size={14} className="text-gray-500" /> Edit
                      </button>
                      <button className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;