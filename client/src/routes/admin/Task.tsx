import React, { useEffect, useState } from "react";
import { Edit, Users } from "lucide-react";
import type {  Project } from "../../types/projects";
import type { Member } from "../../types/members";

type Props = {
  initialMembers?: Member[];
  initialProjects?: Project[];
};

const statusBadgeClass = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "CLOSED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "ON_HOLD":
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const Task: React.FC<Props> = ({
  initialMembers = [],
  initialProjects = [],
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [openFormFor, setOpenFormFor] = useState<Project["id"] | null>(null);
  const [openTaskersFor, setOpenTaskersFor] = useState<Project["id"] | null>(
    null,
  );

  // selected taskers per project (member ids)
  const [selectedByProject, setSelectedByProject] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    // mock fetch
    const mockMembers: Member[] = initialMembers.length
      ? initialMembers
      : [
          {
            id: "m1",
            fullName: "Jeff Mutethia",
            role: "TASKER",
            activeProjects: 2,
          },
          { id: "m2", fullName: "Jane Doe", role: "TASKER", activeProjects: 1 },
          {
            id: "m3",
            fullName: "Mark Smith",
            role: "TASKER",
            activeProjects: 3,
          },
          {
            id: "m4",
            fullName: "Admin User",
            role: "ADMIN",
            activeProjects: 0,
          },
        ];

    const mockProjects: Project[] = initialProjects.length
      ? initialProjects
      : [
          {
            id: 1,
            name: "Project Equator",
            status: "ACTIVE",
            colorClass: "border-slate-500",
            tags: ["Coding"],
            taskers: ["m1"],
            rate: 5000,
          },
          {
            id: 2,
            name: "Project Horizon",
            status: "PENDING",
            colorClass: "border-purple-500",
            tags: ["Research"],
            taskers: ["m2"],
            rate: 4200,
          },
          {
            id: 3,
            name: "Project Aurora",
            status: "ACTIVE",
            colorClass: "border-sky-500",
            tags: ["Design"],
            taskers: [],
            rate: 5500,
          },
        ];

    // simulate network latency
    const t = setTimeout(() => {
      setMembers(mockMembers);
      setProjects(mockProjects);
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, [initialMembers, initialProjects]);

  // Members eligible for selection for a given project:
  // - not ADMIN
  // - not already assigned to the project
  const selectableMembers = (project: Project) => {
    const assigned = new Set(project.taskers ?? []);
    return members.filter((m) => m.role !== "ADMIN" && !assigned.has(m.id));
  };

  const toggleSelect = (projectId: Project["id"], memberId: string) => {
    setSelectedByProject((prev) => {
      const key = String(projectId);
      const current = new Set(prev[key] ?? []);
      if (current.has(memberId)) current.delete(memberId);
      else current.add(memberId);
      return { ...prev, [key]: Array.from(current) };
    });
  };

  const assignSelected = (projectId: Project["id"]) => {
    const key = String(projectId);
    const selected = selectedByProject[key] ?? [];
    if (selected.length === 0) {
      setOpenFormFor(null);
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              taskers: Array.from(new Set([...(p.taskers ?? []), ...selected])),
            }
          : p,
      ),
    );

    // clear selection and close form
    setSelectedByProject((prev) => ({ ...prev, [key]: [] }));
    setOpenFormFor(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-600">
        Loading tasks and members…
      </div>
    );
  }

  return (
    <div className="mx-4 my-5">
      <h1 className="text-4xl my-4 text-slate-800 font-bold">TASKS</h1>

      {/* Quick Stats */}
      <section className="mt-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 text-center">
          <div className="bg-white border border-slate-300/50 min-h-[8em] shadow-md transform hover:-translate-y-1 p-4 duration-200 rounded-lg">
            <h2 className="font-semibold text-sm">Active Task/project</h2>
            <p className="text-2xl font-bold mt-3">
              {projects.filter((p) => p.status === "ACTIVE").length}
            </p>
          </div>
          <div className="bg-white border border-slate-300/50 min-h-[8em] shadow-md transform hover:-translate-y-1 p-4 duration-200 rounded-lg">
            <h2 className="font-semibold text-sm">Pending Task/project</h2>
            <p className="text-2xl font-bold mt-3">
              {projects.filter((p) => p.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-white border border-slate-300/50 min-h-[8em] shadow-md transform hover:-translate-y-1 p-4 duration-200 rounded-lg">
            <h2 className="font-semibold text-sm">Closed Task/project</h2>
            <p className="text-2xl font-bold mt-3">
              {projects.filter((p) => p.status === "CLOSED").length}
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-4 my-12">
        <h2 className="text-xl font-bold mb-2">Task Assignment</h2>
        <p className="mb-4 text-gray-600">
          Assign taskers from the member pool. Admins and already-assigned
          members are excluded.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const selectable = selectableMembers(project);
            const selected = selectedByProject[String(project.id)] ?? [];

            return (
              <div
                key={project.id}
                className={`bg-white border-2 ${project.colorClass ?? "border-slate-300"} rounded p-4 shadow`}>
                <div className="flex justify-between items-start">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded ${statusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                  <div className="text-sm text-gray-600">
                    {project.taskers?.length ?? 0} tasker(s)
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <h3 className="text-2xl text-slate-700 font-semibold">
                    {project.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {project.rate && project.rate > 0
                      ? `${project.rate.toLocaleString()} KES/hr`
                      : "Rate N/A"}
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setOpenTaskersFor((prev) =>
                        prev === project.id ? null : project.id,
                      );
                      setOpenFormFor(null);
                    }}
                    className="bg-slate-50 hover:translate-x-1 duration-200 flex items-center gap-2 shadow px-4 py-1 rounded text-sky-700">
                    <Users /> Active Taskers
                  </button>

                  <button
                    onClick={() => {
                      setOpenFormFor((prev) =>
                        prev === project.id ? null : project.id,
                      );
                      setOpenTaskersFor(null);
                    }}
                    className="border hover:border-sky-800 flex items-center gap-2 px-4 py-1 rounded text-sky-800">
                    <Edit size={15} /> Edit
                  </button>
                </div>

                {/* Multi-select form */}
                {openFormFor === project.id && (
                  <form
                    className="bg-white p-4 max-w-md rounded shadow mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      assignSelected(project.id);
                    }}>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Select Taskers
                    </label>

                    {selectable.length === 0 ? (
                      <div className="text-sm text-gray-500 mb-3">
                        No eligible taskers available
                      </div>
                    ) : (
                      <div className="max-h-40 overflow-auto mb-3 border rounded p-2">
                        {selectable.map((m) => {
                          const isChecked = selected.includes(m.id);
                          return (
                            <label
                              key={m.id}
                              className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleSelect(project.id, m.id)}
                                className="w-4 h-4"
                                aria-label={`Select ${m.fullName}`}
                              />
                              <div className="text-sm">
                                <div className="font-medium text-slate-800">
                                  {m.fullName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {m.role}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-sky-600 text-white px-4 py-2 rounded flex-1"
                        disabled={selected.length === 0}>
                        Assign{" "}
                        {selected.length > 0 ? `(${selected.length})` : ""}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenFormFor(null);
                          setSelectedByProject((prev) => ({
                            ...prev,
                            [String(project.id)]: [],
                          }));
                        }}
                        className="border px-4 py-2 rounded flex-1">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Taskers list */}
                {openTaskersFor === project.id && (
                  <div className="mt-4">
                    <table className="w-full bg-white shadow-md border border-gray-200">
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
                        {project.taskers && project.taskers.length > 0 ? (
                          project.taskers.map((taskerId) => {
                            const t = members.find((m) => m.id === taskerId);
                            if (!t) return null;
                            return (
                              <tr
                                key={t.id}
                                className="hover:bg-slate-50 transition-colors duration-150">
                                <td className="p-3 font-medium text-gray-900">
                                  {t.fullName}
                                </td>
                                <td className="p-3">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    {t.role}
                                  </span>
                                </td>
                                <td className="p-3 text-gray-700">
                                  {t.activeProjects ?? 0}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-4 text-center text-gray-500">
                              No taskers assigned
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Task;