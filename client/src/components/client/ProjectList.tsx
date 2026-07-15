import { useEffect, useState } from "react";
import axios from "axios";
import { LuRefreshCcw } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
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

const getBadgeColor = (status: Project["status"]) => {
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

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get<ProjectsResponse>(
        "https://mini-invoice.onrender.com/api/v1/projects",
      );

      console.log("API Response:", data);

      if (!data.success) {
        throw new Error("Failed to fetch projects.");
      }

      const mappedProjects: Project[] = data.data.map((proj) => ({
        id: proj._id,
        projectName: proj.project_name,
        platform: proj.platform,
        description: proj.description,
        ratePerHour: Number(proj.avg_pay),
        status: proj.status,
      }));

      setProjects(mappedProjects);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          (err.response?.data as { message?: string })?.message ?? err.message,
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Projects
            </h2>
            <p className="text-sm text-gray-500">
              View and manage all your current projects.
            </p>
          </div>

          <button
            onClick={fetchProjects}
            disabled={loading}
            className="rounded flex gap-2 items-center bg-green-600 px-4 py-1 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
            <LuRefreshCcw  className={loading ? "animate-spin" : ""} />
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
              className="w-full text-gray-700 rounded-lg py-3 pl-1"
            />
          </div>
        </div>
      </div>
      {loading && (
        <div className="p-10 text-center text-gray-500">
          Loading projects...
        </div>
      )}

      {!loading && error && (
        <div className="p-10 text-center text-red-600">{error}</div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="p-10 text-center text-gray-500">No projects found.</div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Platform
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Avg Pay
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-green-100 transition">
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {project.projectName}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {project.platform}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {project.description}
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    KES {project.ratePerHour.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeColor(
                        project.status,
                      )}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
