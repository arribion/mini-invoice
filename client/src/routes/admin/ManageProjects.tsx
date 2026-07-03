import ProjectUploadForm from "../../components/admin/ProjectUploadForm";
import ProjectList from "../../components/client/ProjectList";

const ManageProjects = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
        <p className="mt-2 text-gray-600">
          Create new AI projects and manage existing ones.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Project List */}
        <section className="lg:col-span-8">
          <ProjectList />
        </section>

        {/* Project Form */}
        <aside className="lg:col-span-4">
          <ProjectUploadForm />
        </aside>
      </div>
    </div>
  );
};

export default ManageProjects;
