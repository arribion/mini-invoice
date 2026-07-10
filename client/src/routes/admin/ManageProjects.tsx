import { LuCirclePlus } from "react-icons/lu";
import { useState } from "react";
import AdminProjectEdit from "../../components/admin/AdminProjectEdit";
import ProjectUploadForm from "../../components/admin/ProjectUploadForm";
const ManageProjects = () => {
  const [showProjectAddForm, setShowProjectAddForm] = useState(false);
  const toggleProjectAddForm = () => {
    setShowProjectAddForm(showProjectAddForm);
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
        <h1 className="text-2xl font-bold text-sky-700">Manage Projects</h1>
          <p className="mt-2 text-green-600">
            Create new projects and manage existing ones.
          </p>
        </div>

        <div>
          <button
            onClick={toggleProjectAddForm}
            className="flex hover:bg-gray-200 items-center gap-2 border rounded-2xl p-2">
            <LuCirclePlus /> Add Project
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="">
        {/* Project Form */}
        {showProjectAddForm && (
          <aside className="lg:col-span-4 absolute">
            <ProjectUploadForm />
          </aside>
        )}

        {/* Project List */}
        <section className="">
          <AdminProjectEdit />
        </section>
      </div>
    </div>
  );
};

export default ManageProjects;
