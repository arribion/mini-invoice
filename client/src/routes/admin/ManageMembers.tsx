import { useMemo, useState } from "react";
import AddMemberForm from "../../components/admin/AddMemberForm";

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
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Phone
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {members.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="px-6 py-4 text-center text-sm text-gray-500">
              No members available.
            </td>
          </tr>
        ) : (
          members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {member.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.phone ?? "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  type="button"
                  onClick={() => handleEdit(member)}
                  className="mr-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id)}
                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const ManageMembers = () => {

  const [showMemberAddForm, setShowMemberAddForm] = useState(true);

  const toggleMembersForm = () => {
    setShowMemberAddForm((prev) => !prev);
  }

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
        phone: form.phone,
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

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Members</h1>
          <p className="text-gray-600 mt-2">
            Create and manage member accounts.
          </p>
        </div>

        <div>
          <button onClick={toggleMembersForm} className="border rounded-2xl p-2 hover:bg-gray-200">Add Member</button>
        </div>
      </div>

      <div className="">
        {showMemberAddForm && (
          <div className="lg:col-span-4">
            <AddMemberForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              resetForm={resetForm}
              isEditing={isEditing}
            />
          </div>
        )}

        <div className="lg:col-span-8">
          <MembersTable
            members={members}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
