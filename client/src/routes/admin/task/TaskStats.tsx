// src/components/admin/task/TaskStats.tsx
import React, { useMemo } from "react";
import type { Project } from "../../../types/projects";

type Props = {
  projects: Project[];
};

const TaskStats: React.FC<Props> = ({ projects }) => {
  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status === "ACTIVE").length;
    const pending = projects.filter((p) => p.status === "PENDING").length;
    const closed = projects.filter((p) => p.status === "CLOSED").length;
    return { active, pending, closed };
  }, [projects]);

  return (
    <section className="mt-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white border border-slate-300/50 min-h-[8em] shadow-md transform hover:-translate-y-1 p-4 duration-200 rounded-lg">
          <h2 className="font-semibold text-sm">Active Task/project</h2>
          <p className="text-2xl font-bold mt-3">{stats.active}</p>
        </div>
        <div className="bg-white border border-slate-300/50 min-h-[8em] shadow-md transform hover:-translate-y-1 p-4 duration-200 rounded-lg">
          <h2 className="font-semibold text-sm">Pending Task/project</h2>
          <p className="text-2xl font-bold mt-3">{stats.pending}</p>
        </div>
        <div className="bg-white border border-slate-300/50 min-h-[8em] shadow-md transform hover:-translate-y-1 p-4 duration-200 rounded-lg">
          <h2 className="font-semibold text-sm">Closed Task/project</h2>
          <p className="text-2xl font-bold mt-3">{stats.closed}</p>
        </div>
      </div>
    </section>
  );
};

export default TaskStats;
