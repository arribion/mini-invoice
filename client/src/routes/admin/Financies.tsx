import { useState } from 'react'

// Payment status options
export type PaymentStatus = "Pending" | "Completed" | "Overdue";

// Payment methods supported
export type PaymentMethod = "M-PESA" | "Till" | "Bank" | "PayPal";

// Member type
export interface Member {
  id: string; // unique identifier
  name: string; // member full name
  phone: string; // phone number
  status: PaymentStatus; // payment status
  amount: number; // amount due (in KES or other currency)
  method: PaymentMethod; // chosen payment method
  referenceCode?: string; // optional transaction reference
}

const Financies = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Example member data
  const members: Member[] = [
    {
      id: "1",
      name: "Jeff Mutethia",
      phone: "07xx xxx xxx",
      status: "Pending",
      amount: 2500,
      method: "M-PESA",
    },
    {
      id: "2",
      name: "Jane Doe",
      phone: "07xx xxx xxx",
      status: "Completed",
      amount: 0,
      method: "PayPal",
    },
    {
      id: "3",
      name: "Mark Smith",
      phone: "07xx xxx xxx",
      status: "Pending",
      amount: 1200,
      method: "Bank",
    },
  ];

  const openPaymentModal = (member: Member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Member Payments</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="font-semibold">Pending Payments</h2>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="font-semibold">Completed Payments</h2>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="font-semibold">Overdue Payments</h2>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Members Table */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Amount Due</th>
            <th className="border p-2">Method</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.phone}</td>
              <td
                className={`border p-2 ${m.status === "Pending" ? "text-yellow-600" : "text-green-600"}`}>
                {m.status}
              </td>
              <td className="border p-2">KES {m.amount}</td>
              <td className="border p-2">{m.method}</td>
              <td className="border p-2">
                {m.status === "Pending" ? (
                  <button
                    onClick={() => openPaymentModal(m)}
                    className="bg-green-600 text-white px-3 py-1 rounded">
                    Pay
                  </button>
                ) : (
                  <span className="text-green-600 font-bold">✓</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Modal */}
      {showModal && selectedMember && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <p>
              <strong>Member:</strong> {selectedMember.name}
            </p>
            <p>
              <strong>Amount:</strong> KES {selectedMember.amount}
            </p>
            <p>
              <strong>Method:</strong> {selectedMember.method}
            </p>

            <label className="block mt-4 mb-2 font-semibold">
              Reference Code
            </label>
            <input
              type="text"
              placeholder="Enter M-PESA/Bank Ref Code"
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-green-600 text-white px-4 py-2 rounded">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default Financies;
