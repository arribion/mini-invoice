import React from "react";
import { Edit, Users } from "lucide-react";
import type { Project } from "../../types/projects";
import type { Member } from "../../types/members";

interface Props {
  project: Project;
  members: Member[];
  selectableMembers: Member[];
  selected: string[]; // selected member ids for this project
  onToggleSelect: (memberId: string) => void;
  onAssign: () => void;
  openFormFor: Project["id"] | null;
  setOpenFormFor: React.Dispatch<React.SetStateAction<Project["id"] | null>>;
  openTaskersFor: Project["id"] | null;
  setOpenTaskersFor: React.Dispatch<React.SetStateAction<Project["id"] | null>>;
  borderClass?: string;
}

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

const TaskAssignmentCard: React.FC<Props> = ({
  project,
  members,
  selectableMembers,
  selected,
  onToggleSelect,
  onAssign,
  openFormFor,
  setOpenFormFor,
  openTaskersFor,
  setOpenTaskersFor,
  borderClass = "border-slate-300",
}) => {
  return (
    <div className="bg-white rounded p-4 shadow">
      <div className={`border-2 rounded p-4 ${borderClass} bg-white`}>
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
              onAssign();
            }}>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Select Taskers
            </label>

            {selectableMembers.length === 0 ? (
              <div className="text-sm text-gray-500 mb-3">
                No eligible taskers available
              </div>
            ) : (
              <div className="max-h-40 overflow-auto mb-3 border rounded p-2">
                {selectableMembers.map((m) => {
                  const isChecked = selected.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelect(m.id)}
                        className="w-4 h-4"
                        aria-label={`Select ${m.fullName}`}
                      />
                      <div className="text-sm">
                        <div className="font-medium text-slate-800">
                          {m.fullName}
                        </div>
                        <div className="text-xs text-gray-500">{m.role}</div>
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
                Assign {selected.length > 0 ? `(${selected.length})` : ""}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenFormFor(null);
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
                  <th className="p-3 text-left text-sm font-semibold">Name</th>
                  <th className="p-3 text-left text-sm font-semibold">Role</th>
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
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No taskers assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssignmentCard;