// src/components/admin/task/TaskCard.tsx
import React, { useState } from "react";
import { Edit, Users } from "lucide-react";
import type { Project } from "../../../types/projects";
import type { TaskerWithAssignment, Member } from "../../../types/task";
import TaskAssignmentForm from "./TaskAssignmentForm";
import TaskersList from "./TaskersList";

type Props = {
  project: Project;
  projectTaskers: TaskerWithAssignment[];
  availableMembers: Member[];
  onAssignTaskers: (
    projectId: string,
    taskerIds: string[],
    customRate: number | null,
  ) => Promise<void>;
  onRemoveTasker: (assignmentId: string) => Promise<void>;
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

const TaskCard: React.FC<Props> = ({
  project,
  projectTaskers,
  availableMembers,
  onAssignTaskers,
  onRemoveTasker,
}) => {
  const [openFormFor, setOpenFormFor] = useState<Project["id"] | null>(null);
  const [openTaskersFor, setOpenTaskersFor] = useState<Project["id"] | null>(
    null,
  );

  return (
    <div
      className={`bg-white border-2 ${project.colorClass ?? "border-slate-300"} rounded p-4 shadow`}>
      <div className="flex justify-between items-start">
        <span
          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded ${statusBadgeClass(project.status)}`}>
          {project.status}
        </span>
        <div className="text-sm text-gray-600">
          {projectTaskers.length} tasker(s)
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
          <Users size={16} /> View Taskers
        </button>

        <button
          onClick={() => {
            setOpenFormFor((prev) => (prev === project.id ? null : project.id));
            setOpenTaskersFor(null);
          }}
          className="border hover:border-sky-800 flex items-center gap-2 px-4 py-1 rounded text-sky-800">
          <Edit size={15} /> Edit
        </button>
      </div>

      {openFormFor === project.id && (
        <TaskAssignmentForm
          projectRate={project.rate ?? 0}
          availableMembers={availableMembers}
          onAssign={(taskerIds, customRate) =>
            onAssignTaskers(String(project.id), taskerIds, customRate)
          }
          onCancel={() => {
            setOpenFormFor(null);
          }}
        />
      )}

      {openTaskersFor === project.id && (
        <TaskersList taskers={projectTaskers} onRemove={onRemoveTasker} />
      )}
    </div>
  );
};

export default TaskCard;