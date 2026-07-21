import axios from "axios";
import { useEffect, useState } from "react";

type FormState = {
  fullname: string;
  email: string;
  phone: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function SettingsOverview() {
  const base = import.meta.env.VITE_BASE_URL || "";
  const memberPath = "/api/v1/member";

  // Axios instance with baseURL and request interceptor for auth token
  const api = axios.create({
    baseURL: base,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const [form, setForm] = useState<FormState>({
    fullname: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getErrorMessage(err: unknown, fallback: string) {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return fallback;
  }

  function onChange(e: { target: { name: string; value: string } }) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // Fetch current logged-in member details on mount
  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setLoadingProfile(true);
      setError(null);
      try {
        const res = await api.get(memberPath);
        // Adjust mapping if your API uses different keys
        const data = res.data ?? {};
        if (!mounted) return;
        setForm((s) => ({
          ...s,
          fullname: data.name ?? data.fullname ?? "",
          email: data.email ?? "",
          phone: data.phone ?? data.mobile ?? "",
        }));
      } catch (err) {
        if (!mounted) return;
        if (axios.isAxiosError(err)) {
          const msg =
            (err.response?.data &&
              (err.response?.data.message || err.response?.data.error)) ||
            err.message ||
            "Failed to load profile.";
          setError(msg);
        } else {
          setError(getErrorMessage(err, "Unable to fetch profile."));
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]); // base used to rebuild instance if env changes

  async function updateMember(e: { preventDefault: () => void }) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.fullname || !form.email) {
      setError("Full name and email are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.fullname,
        email: form.email,
        phone: form.phone,
      };
      const res = await api.post(memberPath, payload);
      if (res.status >= 200 && res.status < 300) {
        setMessage("Profile updated successfully.");
      } else {
        const msg =
          (res.data && (res.data.message || res.data.error)) ||
          "Failed to update profile.";
        throw new Error(msg);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data &&
            (err.response?.data.message || err.response?.data.error)) ||
          err.message ||
          "An unexpected error occurred.";
        setError(msg);
      } else {
        setError(getErrorMessage(err, "An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e: { preventDefault: () => void }) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.oldPassword || !form.newPassword) {
      setError("Please provide both old and new passwords.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      };
      const res = await api.put(`${memberPath}/password`, payload);
      if (res.status >= 200 && res.status < 300) {
        setMessage("Password changed successfully.");
        setForm((s) => ({
          ...s,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const msg =
          (res.data && (res.data.message || res.data.error)) ||
          "Failed to change password.";
        throw new Error(msg);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data &&
            (err.response?.data.message || err.response?.data.error)) ||
          err.message ||
          "An unexpected error occurred.";
        setError(msg);
      } else {
        setError(getErrorMessage(err, "An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <article className="bg-white shadow-card p-4 rounded-[15px] border text-slate-950">
        <div>
          <h1 className="mt-4 text-2xl text-slate-900 font-semibold">
            Personal Information
          </h1>
          <p className="text-slate-500">Update your bio</p>
        </div>

        <form onSubmit={updateMember} className="bg-white p-4 my-4">
          {loadingProfile ? (
            <p className="text-slate-500">Loading profile...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullname">Full Name:</label>
                  <br />
                  <input
                    id="fullname"
                    name="fullname"
                    value={form.fullname}
                    onChange={onChange}
                    type="text"
                    placeholder="John Doe"
                    className="my-2 border p-1 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <br />
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    type="email"
                    placeholder="John@example.com"
                    className="my-2 border p-1 rounded w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 my-5">
                <div>
                  <label htmlFor="phone">Phone:</label>
                  <br />
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    type="text"
                    placeholder="Phone"
                    className="my-2 border p-1 rounded w-full"
                  />
                </div>
              </div>

              <div className="mb-4">
                {message && <p className="mt-3 text-green-600">{message}</p>}
                {error && <p className="mt-3 text-red-600">{error}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-600 text-white px-4 py-2 rounded">
                  {loading ? "Saving..." : "Save profile"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm((s) => ({
                      ...s,
                      fullname: "",
                      email: "",
                      phone: "",
                    }));
                    setMessage(null);
                    setError(null);
                  }}
                  className="bg-gray-200 px-4 py-2 rounded">
                  Reset
                </button>
              </div>
            </>
          )}
        </form>

        <h1 className="mt-4 text-2xl text-slate-900 font-semibold">
          Update Password
        </h1>
        <form onSubmit={changePassword} className="bg-white p-4 my-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label htmlFor="oldPassword">Old Password: </label>
              <br />
              <input
                id="oldPassword"
                name="oldPassword"
                value={form.oldPassword}
                onChange={onChange}
                type="password"
                placeholder="old Password"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password: </label>
              <br />
              <input
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={onChange}
                type="password"
                placeholder="new Password"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm:</label>
              <br />
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                type="password"
                placeholder="confirm new Password"
                className="my-2 border p-1 rounded w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 text-white px-4 py-2 rounded">
              {loading ? "Updating..." : "Change password"}
            </button>
          </div>
        </form>
      </article>
    </>
  );
}
