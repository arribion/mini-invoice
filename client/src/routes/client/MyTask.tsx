import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../../types/projects";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  currentUserId?: string | number | null;
  initialProjects?: Project[];
  fetchTimeoutMs?: number;
};

const statusBadgeClass = (status?: string) => {
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

async function fetchWithTimeout(
  url: string,
  timeout = 12000,
  init: RequestInit = {},
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

const MyTask: React.FC<Props> = ({
  currentUserId,
  initialProjects = [],
  fetchTimeoutMs = 12000,
}) => {
  const auth = useAuth?.() ?? ({} as any);
  const authUser = auth?.user ?? null;

  const initialProjectsRef = useRef(initialProjects);
  const [projects, setProjects] = useState<Project[]>(
    initialProjectsRef.current,
  );
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve user id
  const resolvedUserId = useMemo(() => {
    if (currentUserId !== undefined && currentUserId !== null)
      return String(currentUserId);
    if (authUser) {
      const u = authUser as any;
      if (u.id) return String(u.id);
      if (u._id) return String(u._id);
      if (u.userId) return String(u.userId);
      if (u.email) return String(u.email);
    }
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.id) return String(parsed.id);
        if (parsed?._id) return String(parsed._id);
        if (parsed?.userId) return String(parsed.userId);
        if (parsed?.email) return String(parsed.email);
      }
    } catch {
      // ignore
    }
    return null;
  }, [currentUserId, authUser]);

  useEffect(() => {
    let mounted = true;
    setError(null);

    const base = (import.meta.env.VITE_BASE_URL ?? "").replace(/\/$/, "");
    const projectsUrl = `${base}/api/v1/projects`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const parsePossibleArray = async (res: Response) => {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) return json;
        if (json && Array.isArray(json.data)) return json.data;
        const firstArray = Object.values(json).find((v) => Array.isArray(v));
        if (firstArray) return firstArray as any[];
        return [];
      } catch {
        return [];
      }
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await fetchWithTimeout(projectsUrl, fetchTimeoutMs, {
          headers,
        });
        if (!mounted) return;
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Projects fetch failed ${res.status} ${body}`);
        }
        const data = await parsePossibleArray(res);
        const normalized = data.map((p: any) => ({
          ...p,
          taskers: Array.isArray(p.taskers) ? p.taskers.map(String) : [],
        }));
        if (!mounted) return;
        setProjects(normalized);
      } catch (err: any) {
        console.error("fetchProjects error:", err);
        setError(
          err.name === "AbortError"
            ? "Projects request timed out."
            : "Could not load projects.",
        );
        setProjects(initialProjectsRef.current);
      } finally {
        if (mounted) setLoadingProjects(false);
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, [fetchTimeoutMs]);

  if (!resolvedUserId) {
    return (
      <div className="mx-4 my-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="font-semibold text-yellow-800">No user detected</p>
          <p className="text-sm text-yellow-700 mt-1">
            Provide <code>currentUserId</code> or ensure your auth hook exposes
            a user id.
          </p>
        </div>
      </div>
    );
  }

  // Only projects where this user is in taskers array
  const myProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          Array.isArray(p.taskers) &&
          p.taskers.map(String).includes(String(resolvedUserId)),
      ),
    [projects, resolvedUserId],
  );

  return (
    <div className="mx-4 my-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">My Tasks</h1>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loadingProjects ? (
        <div className="p-6 text-center text-slate-600">
          Loading your projects…
        </div>
      ) : myProjects.length === 0 ? (
        <div className="p-6 bg-white border rounded shadow-sm text-center text-slate-600">
          <p className="font-medium">No assigned projects</p>
          <p className="text-sm mt-1">
            You currently have no projects assigned.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded p-4 shadow border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {project.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${statusBadgeClass(
                        project.status,
                      )}`}>
                      {project.status}
                    </span>
                    <div className="text-xs text-slate-500">
                      {project.tags?.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  {project.rate && project.rate > 0
                    ? `${project.rate.toLocaleString()} KES/hr`
                    : "Rate N/A"}
                </div>
              </div>

              {project.description && (
                <p className="mt-2 text-sm text-slate-600">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTask;
