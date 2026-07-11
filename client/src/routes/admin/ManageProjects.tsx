import { useEffect, useState } from "react";
import { LuCirclePlus, LuX } from "react-icons/lu";
import ProjectUploadForm from "../../components/admin/ProjectUploadForm";
import axios from "axios";
import ProjectsTable from "../../components/admin/ProjectTable";
export interface Project {
  id: string;
  projectName: string;
  platform: string;
  description: string;
  ratePerHour: number;
  status: "ACTIVE" | "PENDING" | "CLOSED";
}
interface ApiProject {
  _id: string;
  project_name: string;
  platform: string;
  description: string;
  avg_pay: number;
  status: "ACTIVE" | "PENDING" | "CLOSED";
}

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
  console.log("Error fetching base url on project admin edit");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const ManageProjects = () => {
  const [showProjectAddForm, setShowProjectAddForm] = useState(false);

   const [projects, setProjects] = useState<Project[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [search, setSearch] = useState("");

   const fetchProjects = async () => {
     try {
       setLoading(true);

       const response = await api.get("/api/v1/projects");

       const mapped = response.data.data.map((project: ApiProject) => ({
         id: project._id,
         projectName: project.project_name,
         platform: project.platform,
         description: project.description,
         ratePerHour: Number(project.avg_pay),
         status: project.status,
       }));

       setProjects(mapped);
     } catch (error) {
       setError("Failed loading projects");
     } finally {
       setLoading(false);
     }
   };

   useEffect(() => {
     fetchProjects();
   }, []);

   const filteredProjects = projects.filter(
     (project) =>
       project.projectName.toLowerCase().includes(search.toLowerCase()) ||
       project.platform.toLowerCase().includes(search.toLowerCase()),
   );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sky-700">Manage Projects</h1>

          <p className="mt-2 text-green-600">
            Create new projects and manage existing ones.
          </p>
        </div>

        <button
          onClick={() => setShowProjectAddForm(true)}
          className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 shadow-sm hover:bg-sky-50">
          <LuCirclePlus />
          Add Project
        </button>
      </div>

      <ProjectsTable
        projects={filteredProjects}
        loading={loading}
        error={error}
        search={search}
        setSearch={setSearch}
        refresh={fetchProjects}
      />

      {showProjectAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white">
            <button
              onClick={() => setShowProjectAddForm(false)}
              className="absolute right-4 top-4">
              <LuX size={22} />
            </button>

            <div className="max-h-[90vh] overflow-y-auto p-6">
              <ProjectUploadForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
