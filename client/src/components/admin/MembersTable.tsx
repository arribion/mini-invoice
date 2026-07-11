import type { Member } from "../../routes/admin/ManageMembers"

type Props = {
  members: Member[];
  handleEdit: (member: Member) => void;
  handleDelete: (id: string) => void;
};

const MembersTable = ({ members, handleEdit, handleDelete }: Props) => {
  return (
    <div className="overflow-hidden rounded-[10px] border bg-white shadow-sm">
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-lg">Members List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t hover:bg-sky-500">
                <td className="p-4 font-semibold">{member.fullName}</td>

                <td className="p-4">{member.email}</td>

                <td className="p-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {member.role}
                  </span>
                </td>

                <td className="p-4">{member.phone || "-"}</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="border px-3 py-2 rounded-lg">
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;
