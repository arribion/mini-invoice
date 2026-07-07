import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  id: string;
  projectName: string;
  platform: string;
  description: string;
  ratePerHour: number;
  status: "ACTIVE" | "PENDING" | "CLOSED";
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get<Project[]>("/api/v1/projects/get");

      // Basic validation
      if (!Array.isArray(data)) {
        throw new Error("Invalid response from server.");
      }

      setProjects(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
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

  const badgeColor = (status: Project["status"]) => {
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

  return (
    <div className="overflow-hidden rounded-[10px] w-full border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">All Projects</h2>
        <p className="text-sm text-gray-500">
          View and manage all your current projects.
        </p>
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
          <table className="w-full min-w-225">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Project
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Platform
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Approx r/h (KES)
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id} className="transition hover:bg-green-50">
                  <td className="px-6 py-5 font-semibold text-gray-900">
                    {project.projectName}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {project.platform}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {project.description}
                  </td>

                  <td className="px-6 py-5 font-medium text-gray-900">
                    KES {project.ratePerHour.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                        project.status,
                      )}`}>
                      ● {project.status}
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
