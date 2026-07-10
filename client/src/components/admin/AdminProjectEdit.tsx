import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiSearch } from "react-icons/fi";
import { LuRefreshCcw } from "react-icons/lu";

interface Project {
  id: string;
  projectName: string;
  platform: string;
  description: string;
  ratePerHour: number;
  status: "ACTIVE" | "PENDING" | "CLOSED";
}

interface ExpressProjectPayload {
  _id: string;
  project_name: string;
  platform: string;
  description: string;
  avg_pay: number;
  status: "ACTIVE" | "PENDING" | "CLOSED";
}

interface ProjectsResponse {
  success: boolean;
  count: number;
  data: ExpressProjectPayload[];
}

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CLOSED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AdminProjectEdit = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get<ProjectsResponse>(
        "https://mini-invoice.onrender.com/api/v1/projects",
      );

      const mapped: Project[] = data.data.map((project) => ({
        id: project._id,
        projectName: project.project_name,
        platform: project.platform,
        description: project.description,
        ratePerHour: Number(project.avg_pay),
        status: project.status,
      }));

      setProjects(mapped);
      setFilteredProjects(mapped);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("Failed to load projects.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredProjects(
      projects.filter(
        (project) =>
          project.projectName.toLowerCase().includes(value) ||
          project.platform.toLowerCase().includes(value) ||
          project.description.toLowerCase().includes(value),
      ),
    );
  }, [search, projects]);

  return (
    <div className="w-full rounded-xl bg-white shadow-md">
      {/* Header */}

      <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View, search and edit all projects.
          </p>
        </div>

        <button
          onClick={fetchProjects}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
          <LuRefreshCcw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search */}

      <div className="border-b p-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border py-3 pl-11 pr-4 outline-none transition focus:border-green-500"
          />
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="p-10 text-center text-gray-500">
          Loading projects...
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="p-10 text-center text-red-600">{error}</div>
      )}

      {/* Empty */}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="p-10 text-center text-gray-500">No projects found.</div>
      )}

      {/* Table */}

      {!loading && !error && filteredProjects.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Project
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Platform
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Description
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Rate / Hr
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b transition hover:bg-green-50">
                  <td className="px-6 py-5 font-semibold">
                    {project.projectName}
                  </td>

                  <td className="px-6 py-5">{project.platform}</td>

                  <td className="max-w-xs truncate px-6 py-5 text-gray-600">
                    {project.description}
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    KES {project.ratePerHour.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        project.status,
                      )}`}>
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <button className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700">
                        <FiEdit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}

      {!loading && (
        <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4 text-sm text-gray-600">
          <span>
            Total Projects:{" "}
            <span className="font-semibold">{filteredProjects.length}</span>
          </span>

          <span>Admin Dashboard</span>
        </div>
      )}
    </div>
  );
};

export default AdminProjectEdit;
