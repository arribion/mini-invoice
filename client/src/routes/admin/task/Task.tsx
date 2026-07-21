// src/components/admin/task/Task.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import type { Project } from "../../../types/projects";
import type { Member, ProjectAssignment } from "../../../types/task";
import TaskStats from "./TaskStats";
import TaskCard from "./TaskCard";
import MembersOverview from "./MembersOverview";

type Props = {
  initialProjects?: Project[];
};

const Task: React.FC<Props> = ({ initialProjects = [] }) => {
  const [projects, setProjects] = useState<Project[]>(() => initialProjects);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const fetchAttempted = useRef(false);

  const getColorClass = useCallback((status: string): string => {
    switch ((status || "").toUpperCase()) {
      case "ACTIVE":
        return "border-emerald-500";
      case "PENDING":
        return "border-amber-500";
      case "CLOSED":
        return "border-slate-500";
      case "ON_HOLD":
        return "border-yellow-500";
      default:
        return "border-slate-300";
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch projects
      try {
        const projectsResponse = await axios.get(`${BASE_URL}/api/v1/projects`);
        const projectsData = projectsResponse.data.data || [];

        if (projectsData.length > 0) {
          const transformedProjects: Project[] = projectsData.map((p: any) => ({
            id: p._id,
            name: p.project_name,
            status: p.status || "PENDING",
            colorClass: getColorClass(p.status),
            tags: [p.platform || "General"],
            taskers: p.taskers || [],
            rate: p.avg_pay || 0,
            description: p.description,
            revenueSplit: p.revenueSplit,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }));
          setProjects(transformedProjects);
        } else if (initialProjects.length > 0) {
          setProjects(initialProjects);
        }
      } catch (projectErr) {
        console.error("Error fetching projects:", projectErr);
        if (initialProjects.length > 0) {
          setProjects(initialProjects);
        }
      }

      // Fetch members
      try {
        const membersResponse = await axios.get(`${BASE_URL}/api/v1/members`);
        const membersData = membersResponse.data.data || [];
        setMembers(membersData);
      } catch (memberErr) {
        console.error("Error fetching members:", memberErr);
      }

      // Fetch assignments
      try {
        const assignmentsResponse = await axios.get(
          `${BASE_URL}/api/v1/project-assignments`,
        );
        const assignmentsData = assignmentsResponse.data.data || [];
        setAssignments(assignmentsData);
      } catch (assignmentErr) {
        console.error("Error fetching assignments:", assignmentErr);
      }

      setIsDataLoaded(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, [BASE_URL, initialProjects, getColorClass]);

  // Get taskers assigned to a project
  const getProjectTaskers = useCallback(
    (projectId: string) => {
      const projectAssignments = assignments.filter(
        (a) => a.project_id === projectId && a.status !== "REMOVED",
      );
      return projectAssignments.map((a) => {
        const member = members.find((m) => m._id === a.tasker_id);
        return {
          assignment: a,
          member,
        };
      });
    },
    [assignments, members],
  );

  // Get members not assigned to a project
  const getAvailableMembers = useCallback(
    (projectId: string) => {
      const assignedIds = new Set(
        assignments
          .filter((a) => a.project_id === projectId && a.status !== "REMOVED")
          .map((a) => a.tasker_id),
      );
      return members.filter(
        (m) => m.role === "TASKER" && !assignedIds.has(m._id),
      );
    },
    [assignments, members],
  );

  const handleAssignTaskers = async (
    projectId: string,
    taskerIds: string[],
    customRate: number | null,
  ) => {
    try {
      const assignmentPromises = taskerIds.map((taskerId) => {
        return axios.post(`${BASE_URL}/api/v1/project-assignments`, {
          project_id: projectId,
          tasker_id: taskerId,
          custom_rate: customRate,
          status: "ASSIGNED",
        });
      });

      await Promise.all(assignmentPromises);

      // Fetch updated assignments
      const assignmentsResponse = await axios.get(
        `${BASE_URL}/api/v1/project-assignments`,
      );
      setAssignments(assignmentsResponse.data.data || []);
    } catch (err) {
      console.error("Error assigning taskers:", err);
      throw err;
    }
  };

  const handleRemoveTasker = async (assignmentId: string) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v1/project-assignments/${assignmentId}`,
        {
          status: "REMOVED",
          removed_at: new Date().toISOString(),
        },
      );

      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignmentId
            ? { ...a, status: "REMOVED", removed_at: new Date().toISOString() }
            : a,
        ),
      );
    } catch (err) {
      console.error("Error removing tasker:", err);
      throw err;
    }
  };

  const handleRetry = useCallback(() => {
    fetchAttempted.current = false;
    window.location.reload();
  }, []);

  if (loading && !isDataLoaded) {
    return (
      <div className="p-6 text-center text-slate-600">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
          <span>Loading projects and members…</span>
        </div>
      </div>
    );
  }

  if (error && !isDataLoaded) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">{error}</div>
        <button
          onClick={handleRetry}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 my-5">
      <h1 className="text-4xl my-4 text-slate-800 font-bold">TASKS</h1>

      <TaskStats projects={projects} />

      <section className="mx-4 my-12">
        <h2 className="text-xl font-bold mb-2">Task Assignment</h2>
        <p className="mb-4 text-gray-600">
          Assign taskers to projects and manage their assignments.
        </p>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No projects available. Create a project first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => {
              const projectTaskers = getProjectTaskers(String(project.id));
              const availableMembers = getAvailableMembers(String(project.id));

              return (
                <TaskCard
                  key={String(project.id)}
                  project={project}
                  projectTaskers={projectTaskers}
                  availableMembers={availableMembers}
                  onAssignTaskers={handleAssignTaskers}
                  onRemoveTasker={handleRemoveTasker}
                />
              );
            })}
          </div>
        )}
      </section>

      <MembersOverview members={members} assignments={assignments} />
    </div>
  );
};

export default Task;