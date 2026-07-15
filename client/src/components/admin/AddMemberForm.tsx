import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

type MemberRole = "Software Engineer" | "Admin" | "Manager" | "Reviewer";

type FormData = {
  id?: string; // Included to track updates on existing records
  fullName: string;
  email: string;
  password?: string;
  role: MemberRole;
  phone: string;
};

type Props = {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSuccess: () => void; // Parent callback hook to trigger data re-fetching
  resetForm: () => void;
  isEditing: boolean;
};

const AddMemberForm = ({
  form,
  setForm,
  onSuccess,
  resetForm,
  isEditing,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Create isolated instance referencing environment base configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev: FormData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const internalSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setApiError("");

      if (isEditing) {
        // PUT /api/v1/members/:id for modifying existing data indexes
        await api.put(`/api/v1/members/${form.id}`, {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          phone: form.phone,
        });
      } else {
        // POST /api/v1/members for creation tracks
        await api.post("/api/v1/members", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone,
        });
      }

      onSuccess(); // Triggers the parent's table listing re-sync function
      resetForm(); // Closes structural modal windows
    } catch (err: any) {
      setApiError(
        err.response?.data?.message ||
          "Failed to commit record changes to server indices.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={internalSubmitHandler} className="space-y-4">
      {/* Network Response Dynamic Alert Window */}
      {apiError && (
        <div className="p-3 text-xs font-medium bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          {apiError}
        </div>
      )}

      {/* Name Input */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Full Name
        </label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          required
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition disabled:opacity-50"
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          type="email"
          required
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition disabled:opacity-50"
        />
      </div>

      {/* Password Conditional Input */}
      {!isEditing && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
            Account Password
          </label>
          <input
            name="password"
            value={form.password || ""}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition disabled:opacity-50"
          />
        </div>
      )}

      {/* Role Selector dropdown */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Workspace Permissions Role
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition cursor-pointer disabled:opacity-50">
          <option value="Software Engineer">Software Engineer</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Reviewer">Reviewer</option>
        </select>
      </div>

      {/* Phone Contact Input */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Phone Number
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+254 700 000 000"
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 transition disabled:opacity-50"
        />
      </div>

      {/* Action Button Blocks */}
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
          className="flex-1 justify-center inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition active:scale-[0.98] disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 justify-center inline-flex items-center gap-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:bg-gray-700 disabled:cursor-not-allowed">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              Saving...
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Register Member"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddMemberForm;