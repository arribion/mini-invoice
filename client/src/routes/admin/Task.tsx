import { useState } from "react";

const Task = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTaskers, setShowTaskers] = useState(false);

  // Existing member list (pulled from platform)
  const members = [
    { name: "Jeff Mutethia", role: "Frontend Engineer", activeProjects: 2 },
    { name: "Jane Doe", role: "Backend Engineer", activeProjects: 1 },
    { name: "Mark Smith", role: "UI/UX Designer", activeProjects: 3 },
  ];

  // Example projects with unique colors
  const projects = [
    {
      id: 1,
      name: "Project Equator",
      status: "Active",
      color: "bg-sky-100 border-sky-500",
      tags: ["Coding", "Sprint 3"],
      taskers: [],
    },

    {
      id: 2,
      name: "Project Horizon",
      status: "Pending",
      color: "bg-purple-100 border-purple-500",
      tags: ["Research", "Design"],
      taskers: [],
    },
    {
      id: 3,
      name: "Project Equator",
      status: "Active",
      color: "bg-sky-100 border-sky-500",
      tags: ["Coding", "Sprint 3"],
      taskers: [],
    },
    {
      id: 4,
      name: "Project Atlas",
      status: "Closed",
      color: "bg-green-100 border-green-500",
      tags: ["Deployment", "QA"],
      taskers: [],
    },
  ];

  return (
    <>
      <div className="mx-4 my-5">
        <div>
          <h1 className="text-4xl my-4 text-slate-800 font-bold">TASKS</h1>
        </div>
        {/* Quick Stats */}
        <section className="mt-4">
          <div className="grid gap-4 grid-cols-3 text-center">
            <div className="bg-white border border-slate-300/50  min-h-[8em] shadow-md hover:transform hover:-translate-y-1 p-4 duration-500 rounded-lg">
              <h1 className="font-semibold">Active Task/project</h1>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-white border border-slate-300/50  min-h-[8em] shadow-md hover:transform hover:-translate-y-1 p-4 duration-500 rounded-lg">
              <h1 className="font-semibold">Pending Task/project</h1>
              <p className="text-2xl font-bold">6</p>
            </div>
            <div className="bg-white border border-slate-300/50  min-h-[8em] shadow-md hover:transform hover:-translate-y-1 p-4 duration-500 rounded-lg">
              <h1 className="font-semibold">Closed Task/project</h1>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mx-4 my-12">
          <h1 className="text-xl font-bold mb-2">Task Assignment</h1>
          <p className="mb-4 text-gray-600">
            Assign tasks to specific members based on individual
            capabilities/onboarding.
          </p>

          {projects.map((project) => (
            <div
              key={project.id}
              className={`${project.color} border-2 rounded p-4 shadow mb-6`}>
              <article className="relative mb-4">
                <span className="absolute top-0 right-0 bg-green-600 text-white px-4 text-[9px] py-1 rounded-3xl">
                  {project.status}
                </span>
                <h1 className="text-3xl font-semibold">{project.name}</h1>
                <div className="flex gap-2 text-sm text-gray-500 mt-2">
                  <span>Current taskers: {project.taskers.length}</span>
                  {project.tags.map((tag, i) => (
                    <span key={i}>| {tag}</span>
                  ))}
                </div>

                <div className="flex gap-4 justify-start mt-4">
                  <button
                    onClick={() => {
                      setActiveProject(project.id);
                      setShowForm(!showForm);
                    }}
                    className="bg-sky-500 px-5 py-1 rounded text-white">
                    Add a Tasker
                  </button>
                  <button
                    onClick={() => {
                      setActiveProject(project.id);
                      setShowTaskers(!showTaskers);
                    }}
                    className="bg-sky-500 px-5 py-1 rounded text-white">
                    Active Taskers
                  </button>
                </div>
              </article>

              {/* Add Tasker Dropdown */}
              {showForm && activeProject === project.id && (
                <div className="bg-white p-4 rounded shadow mb-4">
                  <h2 className="text-lg font-semibold mb-2">Select Tasker</h2>
                  <select className="border p-2 w-full mb-2 rounded">
                    {members.map((m, i) => (
                      <option key={i} value={m.name}>
                        {m.name} - {m.role}
                      </option>
                    ))}
                  </select>
                  <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Assign
                  </button>
                </div>
              )}

              {/* Taskers List */}
              {showTaskers && activeProject === project.id && (
                <table className="w-full bg-white  shadow-md mt-6 border border-gray-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="p-3 text-left text-sm font-semibold">
                        Role
                      </th>
                      <th className="p-3 text-left text-sm font-semibold">
                        Active Projects
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {members.map((t, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="p-3 font-medium text-gray-900">
                          {t.name}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {t.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700">
                          {t.activeProjects}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default Task;
