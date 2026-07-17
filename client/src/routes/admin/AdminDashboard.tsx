import {
  Users,
  FolderKanban,
  BadgeCheck,
  Clock3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import QuickActions from "../../components/admin/QuickActions";

const stats = [
  {
    label: "Total Members",
    value: "12",
    change: "+12%",
    trend: "up",
    icon: Users,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    label: "Total Projects",
    value: "8",
    change: "+4%",
    trend: "up",
    icon: FolderKanban,
    accent: "bg-green-50 text-green-600",
  },
  {
    label: "Paid Users",
    value: "92",
    change: "+18%",
    trend: "up",
    icon: BadgeCheck,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Pending Payments",
    value: "16",
    change: "-3%",
    trend: "down",
    icon: Clock3,
    accent: "bg-amber-50 text-amber-600",
  },
];

const recentPayments = [
  {
    name: "John Doe",
    project: "Project Vox",
    amount: "KES 1,000",
    status: "Paid",
  },
  {
    name: "Mary Wanjiku",
    project: "Orion Data",
    amount: "KES 850",
    status: "Pending",
  },
  {
    name: "Peter Otieno",
    project: "Gemini QA",
    amount: "KES 1,250",
    status: "Paid",
  },
  {
    name: "Amina Yusuf",
    project: "Alpha Review",
    amount: "KES 700",
    status: "Pending",
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of members, projects, payments, and pending balances.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          const TrendIcon = item.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-2xl p-3 ${item.accent}`}>
                  <Icon size={22} />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                <TrendIcon
                  size={18}
                  className={
                    item.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                />
                <span
                  className={
                    item.trend === "up" ? "text-green-600" : "text-red-600"
                  }>
                  {item.change}
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Payments Overview
              </h2>
              <p className="text-sm text-gray-500">
                Track paid and pending user payments.
              </p>
            </div>

            <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Live Summary
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Paid Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">92</p>
              <p className="mt-1 text-sm text-green-600">
                68% of total members
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">16</p>
              <p className="mt-1 text-sm text-amber-600">Follow up required</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Total Payed Out</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                KES 284,500
              </p>
              <p className="mt-1 text-sm text-gray-600">This month</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">27</p>
              <p className="mt-1 text-sm text-gray-600">Currently running</p>
            </div>
          </div>
        </div>
        <QuickActions/>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Payments
          </h2>
          <p className="text-sm text-gray-500">
            Latest payment activity across members.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Member
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Project
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentPayments.map((payment, index) => (
                <tr key={index} className="transition hover:bg-green-50">
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {payment.name}
                  </td>
                  <td className="px-6 py-5 text-gray-700">{payment.project}</td>
                  <td className="px-6 py-5 text-gray-700">{payment.amount}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
