import ProjectList from "../../components/client/ProjectList";

const Projects = () => {
  return (
    <section className="px-4">
        <div className="mx-4">
          <p className="text-sm font-medium text-green-600">
            Dashboard / Projects
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-sky-500">
            PROJECTS
          </h1>
      </div>
      

        <ProjectList />
    </section>
  );
};

export default Projects;
