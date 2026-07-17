// src/components/admin/AddMemberForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export type MemberRole = "Admin" | "Manager" | "Reviewer" | "Software Engineer";

export type FormData = {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: MemberRole;
  phone: string;
};

type Props = {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onSuccess: () => void;
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

  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const internalSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto‑generate password from phone if missing on create
    let passwordToUse = form.password;
    if (!isEditing && !passwordToUse && form.phone) {
      passwordToUse = form.phone;
    }

    if (!form.fullName || !form.email || (!isEditing && !passwordToUse)) {
      setApiError("Full name, email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      if (isEditing && form.id) {
        await api.put(`/api/v1/members/${form.id}`, {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          phone: form.phone,
        });
      } else {
        await api.post("/api/v1/members", {
          fullName: form.fullName,
          email: form.email,
          password: passwordToUse,
          role: form.role,
          phone: form.phone,
        });
      }

      onSuccess();
      resetForm();
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to commit record changes.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={internalSubmitHandler} className="space-y-4">
      {apiError && (
        <div className="p-3 text-xs font-medium bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          {apiError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
          Full Name
        </label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          required
          disabled={isSubmitting}
          className="w-full rounded border px-4 py-2.5 text-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
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
          className="w-full rounded border px-4 py-2.5 text-sm"
        />
      </div>

      {/* Password (only for new members) */}
      {!isEditing && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
            Account Password
          </label>
          <div className="px-1 py-2 border-2 border-yellow-500 rounded bg-yellow-50 my-2 text-xs">
            Leave blank to use phone number as password.
          </div>
          <input
            name="password"
            value={form.password || ""}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            disabled={isSubmitting}
            className="w-full rounded border px-4 py-2.5 text-sm"
          />
        </div>
      )}

      {/* Role */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
          Workspace Permissions Role
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full rounded border px-4 py-2.5 text-sm">
          <option value="Reviewer">Reviewer</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
          <option value="Software Engineer">Software Engineer</option>
        </select>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
          Phone Number
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+254 700 000 000"
          disabled={isSubmitting}
          className="w-full rounded border px-4 py-2.5 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
          className="flex-1 rounded border px-4 py-2.5 text-sm font-semibold">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded bg-sky-900 hover:bg-sky-800 px-4 py-2.5 text-sm font-semibold text-white">
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