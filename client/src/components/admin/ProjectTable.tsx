import { FiEdit2, FiSearch } from "react-icons/fi";
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
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "CLOSED":
      return "bg-red-100 text-red-700";
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
    <div className="rounded-xl bg-white shadow-md">
      <div className="flex justify-between items-center border-b p-6">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>

          <p className="text-sm text-gray-500">View and manage projects</p>
        </div>

        <button
          onClick={refresh}
          className="rounded flex gap-2 items-center bg-green-600 px-4 py-1 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
          <LuRefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="border-b p-6">
        <div className="flex  border rounded-lg pl-2 items-center">
          <FiSearch className="text-gray-700" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg py-3 pl-1"
          />
        </div>
      </div>

      {loading && <div className="p-10 text-center">Loading projects...</div>}

      {error && <div className="p-10 text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Project</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Rate</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-green-50">
                <td className="p-4 font-semibold">{project.projectName}</td>

                <td className="p-4">{project.platform}</td>

                <td className="p-4">KES {project.ratePerHour}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>

                <td className="p-4">
                  <button className="rounded-lg bg-blue-600 p-2 text-white">
                    <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectsTable;
