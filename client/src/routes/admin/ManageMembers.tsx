import { useMemo, useState, useEffect } from "react";
import AddMemberForm from "../../components/admin/AddMemberForm";
import { Plus, X } from "lucide-react";

type MemberRole = "Software Engineer" | "Admin" | "Manager" | "Reviewer";

export type Member = {
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
    email: "john@example.com",
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

type MembersTableProps = {
  members: Member[];
  handleEdit: (member: Member) => void;
  handleDelete: (id: string) => void;
};

const MembersTable = ({
  members,
  handleEdit,
  handleDelete,
}: MembersTableProps) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200 text-left">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Name
          </th>
          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Email
          </th>
          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Role
          </th>
          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Phone
          </th>
          <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
        {members.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="px-6 py-12 text-center text-gray-400 font-medium">
              No members available in the repository index.
            </td>
          </tr>
        ) : (
          members.map((member) => (
            <tr
              key={member.id}
              className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-900">
                {member.fullName}
              </td>
              <td className="px-6 py-4 text-gray-500">{member.email}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                  {member.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{member.phone ?? "—"}</td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(member)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id)}
                    className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const ManageMembers = () => {
  const [showMemberAddForm, setShowMemberAddForm] = useState(false);
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

  // Trap body layout scrollbars when the modal panel is mounted open
  useEffect(() => {
    if (showMemberAddForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMemberAddForm]);

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "Software Engineer",
      phone: "",
    });
    setEditingId(null);
    setShowMemberAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || (!isEditing && !form.password)) return;

    if (isEditing && editingId) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingId
            ? {
                ...member,
                fullName: form.fullName,
                email: form.email,
                role: form.role,
                phone: form.phone,
              }
            : member,
        ),
      );
    } else {
      const newMember: Member = {
        id: crypto.randomUUID(),
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        phone: form.phone || undefined,
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
    setShowMemberAddForm(true); // Open structural modal instantly on row edit target
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this staff member entry path?")) return;
    setMembers((prev) => prev.filter((member) => member.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 relative">
      {/* Top Banner Toolbar */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Manage Members
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, update permissions, and manage organization profile
            directories.
          </p>
        </div>
        <button
          onClick={() => setShowMemberAddForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]">
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Primary Context Data Table Layout */}
      <div className="w-full">
        <MembersTable
          members={members}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      {/* Global Form Modal Overlay Backdrop */}
      {showMemberAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
          onClick={resetForm} // Closes modal backdrop cleanly on outside workspace clicks
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Halts bubble intercept execution
          >
            {/* Modal Context Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isEditing
                    ? "Modify Member Credentials"
                    : "Register Corporate Profile"}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Fill out authorization parameters below.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Inner Panel Form Content Body */}
            <div className="p-6 overflow-y-auto">
              <AddMemberForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                resetForm={resetForm}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;