import ProjectList from "../../components/ProjectList";

const Projects = () => {
  return (
    <div>
      {" "}
      {/* PROJECT LIST */}
      <div className="my-6">
        <div className="mt-4">
          <p className="text-sm font-medium text-green-600">
            Dashboard / Invoices
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            PROJECT <span className="text-sky-500">INVOICES</span>
          </h1>

          <p className="mt-2 text-slate-500">
            Choose project for tasking
          </p>
        </div>
        <ProjectList />
      </div>
    </div>
  );
};

export default Projects;
