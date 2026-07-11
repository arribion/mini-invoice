import React from "react";

type Props = {
  form: any;
  setForm: any;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  isEditing: boolean;
};

const AddMemberForm = ({
  form,
  setForm,
  handleSubmit,
  resetForm,
  isEditing,
}: Props) => {
  const handleChange = (e: any) => {
    setForm((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="rounded-[10px] max-w-md absolute z-50 border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-1">
        {isEditing ? "Edit Member" : "Create Member"}
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        {isEditing
          ? "Update member information"
          : "Create new member credentials"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full rounded-xl border px-4 py-3"
        />

        {!isEditing && (
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border px-4 py-3"
          />
        )}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3">
          <option>Software Engineer</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Reviewer</option>
        </select>

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full rounded-xl border px-4 py-3"
        />

        <div className="flex gap-3">
          <button className="flex-1 rounded-xl bg-green-600 py-3 text-white">
            {isEditing ? "Update" : "Create"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="border rounded-xl px-4">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddMemberForm;
