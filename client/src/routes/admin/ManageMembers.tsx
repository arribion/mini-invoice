import { useMemo, useState } from "react";

type MemberRole = "Software Engineer" | "Admin" | "Manager" | "Reviewer";

type Member = {
  id: string;
  fullName: string;
  email: string;
  role: MemberRole;
  phone?: string;
};

const initialMembers: Member[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "John@example.com",
    role: "Software Engineer",
    phone: "+254700000001",
  },
  {
    id: "2",
    fullName: "Mary Wanjiku",
    email: "mary@example.com",
    role: "Reviewer",
    phone: "+254700000002",
  },
];

const ManageMembers = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Software Engineer" as MemberRole,
    phone: "",
  });

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "Software Engineer",
      phone: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      (!isEditing && !form.password.trim())
    ) {
      return;
    }

    if (isEditing && editingId) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingId
            ? {
                ...member,
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                role: form.role,
                phone: form.phone.trim(),
              }
            : member,
        ),
      );
    } else {
      const newMember: Member = {
        id: crypto.randomUUID(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
        phone: form.phone.trim(),
      };

      setMembers((prev) => [newMember, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setForm({
      fullName: member.fullName,
      email: member.email,
      password: "",
      role: member.role,
      phone: member.phone ?? "",
    });
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Members</h1>
        <p className="mt-2 text-gray-600">
          Create member login credentials and manage the full member list.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Member" : "Create Member"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? "Update the member details below."
                  : "Add a new member and set login credentials."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Temporary password"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500">
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  placeholder="+2547..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700">
                  {isEditing ? "Update Member" : "Create Member"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <section className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Members List
              </h2>
              <p className="text-sm text-gray-500">
                View, edit, and delete member accounts.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-225">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="transition hover:bg-green-50">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {member.fullName}
                          </p>
                          <p className="text-sm text-gray-500">Member</p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {member.email}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {member.role}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {member.phone || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {members.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-gray-500">
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageMembers;
