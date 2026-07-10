import ProjectList from "../../components/client/ProjectList";

const Projects = () => {
  return (
    <div className="px-4 py-2">
      {" "}
      {/* PROJECT LIST */}
      <div className="my-6">
        <div className="mt-4">
          <p className="text-sm font-medium text-green-600">
            Dashboard / Projects
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            TASKING <span className="text-sky-500">PROJECTS</span>
          </h1>

          <p className="mt-2 text-slate-500">Choose project for tasking</p>
        </div>
        <ProjectList />
      </div>
    </div>
  );
};

export default Projects;
