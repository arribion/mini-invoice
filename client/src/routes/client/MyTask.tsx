import React, { useEffect, useMemo, useRef, useState } from "react";
import { Users } from "lucide-react";
import type { Project } from "../../types/projects";
import type { Member } from "../../types/members";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  currentUserId?: string | number | null;
  authToken?: string | null; // optional bearer token for APIs that require auth
  initialMembers?: Member[];
  initialProjects?: Project[];
  fetchTimeoutMs?: number;
};

const BORDER_CLASSES = [
  "border-sky-400",
  "border-emerald-400",
  "border-rose-400",
  "border-amber-400",
  "border-violet-400",
  "border-slate-400",
];

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
  authToken = null,
  initialMembers = [],
  initialProjects = [],
  fetchTimeoutMs = 12000,
}) => {
  const auth = useAuth?.() ?? ({} as any);
  const authUser = auth?.user ?? null;

  // keep initial props stable
  const initialMembersRef = useRef(initialMembers);
  const initialProjectsRef = useRef(initialProjects);

  const [projects, setProjects] = useState<Project[]>(
    initialProjectsRef.current,
  );
  const [members, setMembers] = useState<Member[]>(initialMembersRef.current);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedProject, setExpandedProject] = useState<Project["id"] | null>(
    null,
  );

  const borderMapRef = useRef<Map<string, string>>(new Map());
  const getBorderClass = (id: string | number) => {
    const key = String(id);
    const map = borderMapRef.current;
    if (!map.has(key)) {
      const cls =
        BORDER_CLASSES[Math.floor(Math.random() * BORDER_CLASSES.length)];
      map.set(key, cls);
    }
    return map.get(key)!;
  };

  // Resolve user id from prop, auth, or localStorage (stable)
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
    const membersUrl = `${base}/api/v1/members`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

    const controllerProjects = new AbortController();
    const controllerMembers = new AbortController();

    const parsePossibleArray = async (res: Response) => {
      // try to parse JSON and accept either an array or { data: array } shape
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) return json;
        if (json && Array.isArray(json.data)) return json.data;
        // if server returns object with items under other key, try to find first array
        const firstArray = Object.values(json).find((v) => Array.isArray(v));
        if (firstArray) return firstArray as any[];
        // fallback: return empty array
        return [];
      } catch {
        // not JSON
        return [];
      }
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        console.info("Fetching projects from:", projectsUrl);
        const res = await fetchWithTimeout(projectsUrl, fetchTimeoutMs, {
          headers,
          signal: controllerProjects.signal,
        });
        if (!mounted) return;
        console.info("Projects status:", res.status);
        if (!res.ok) {
          const body = await safeText(res);
          throw new Error(`Projects fetch failed ${res.status} ${body}`);
        }
        const data = await parsePossibleArray(res);
        // normalize taskers to string ids
        const normalized = data.map((p: any) => ({
          ...p,
          taskers: Array.isArray(p.taskers) ? p.taskers.map(String) : [],
        }));
        if (!mounted) return;
        setProjects(normalized);
      } catch (err: any) {
        console.error("fetchProjects error:", err);
        setError(
          (prev) =>
            prev ??
            (err.name === "AbortError"
              ? "Projects request timed out."
              : "Could not load projects."),
        );
        setProjects(initialProjectsRef.current);
      } finally {
        if (mounted) setLoadingProjects(false);
      }
    };

    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        console.info("Fetching members from:", membersUrl);
        const res = await fetchWithTimeout(membersUrl, fetchTimeoutMs, {
          headers,
          signal: controllerMembers.signal,
        });
        if (!mounted) return;
        console.info("Members status:", res.status);
        if (!res.ok) {
          const body = await safeText(res);
          throw new Error(`Members fetch failed ${res.status} ${body}`);
        }
        const data = await parsePossibleArray(res);
        if (!mounted) return;
        setMembers(data);
      } catch (err: any) {
        console.error("fetchMembers error:", err);
        setError(
          (prev) =>
            prev ??
            (err.name === "AbortError"
              ? "Members request timed out."
              : "Could not load members."),
        );
        setMembers(initialMembersRef.current);
      } finally {
        if (mounted) setLoadingMembers(false);
      }
    };

    (async () => {
      await fetchProjects();
      // start members fetch in background
      fetchMembers();
    })();

    return () => {
      mounted = false;
      controllerProjects.abort();
      controllerMembers.abort();
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function safeText(res: Response) {
    try {
      return await res.text();
    } catch {
      return "";
    }
  }

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

  // ensure we compare strings
  const myProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          Array.isArray(p.taskers) &&
          p.taskers.map(String).includes(String(resolvedUserId)),
      ),
    [projects, resolvedUserId],
  );

  const findMember = (id: string) =>
    members.find((m) => String(m.id) === String(id)) ?? null;

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
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myProjects.map((project) => {
          const matesIds = (project.taskers ?? [])
            .map(String)
            .filter((id) => id !== String(resolvedUserId));
          const mates = matesIds.map(findMember).filter(Boolean) as Member[];
          const borderClass = getBorderClass(project.id);

          return (
            <div key={project.id} className="bg-white rounded p-4 shadow">
              <div className={`rounded p-3 border-2 ${borderClass} bg-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      {project.name}
                    </h2>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${statusBadgeClass(project.status)}`}>
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

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users />
                    <span className="text-sm">
                      {project.taskers?.length ?? 0} tasker(s)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedProject((prev) =>
                        prev === project.id ? null : project.id,
                      )
                    }
                    className="text-sky-700 text-sm px-3 py-1 rounded border hover:bg-sky-50">
                    {expandedProject === project.id
                      ? "Hide mates"
                      : `Show mates (${mates.length})`}
                  </button>
                </div>

                {expandedProject === project.id && (
                  <div className="mt-4">
                    {loadingMembers ? (
                      <div className="text-sm text-gray-500 h-20 flex items-center justify-center">
                        Loading mates…
                      </div>
                    ) : mates.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        You are the only tasker on this project.
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {mates.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                            <div>
                              <div className="font-medium text-slate-800">
                                {m.fullName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {m.role}
                              </div>
                            </div>
                            <div className="text-sm text-slate-600">
                              {m.activeProjects ?? 0} projects
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTask;