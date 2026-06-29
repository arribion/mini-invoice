
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Activity, Plus } from "lucide-react";

import { BalanceCard } from "../../components/BalanceCard";
import { QuickActions } from "../../components/QuickActions";
import { TransactionList } from "../../components/TransactionList";
import { SendMoneyDialog } from "../../components/CreateInvoiceDialog";
import PaymentMethods from "../../components/PaymentMethods";

function Dashboard() {
  const [sendOpen, setSendOpen] = useState(false);

  const stats = [
    {
      label: "Paid",
      value: "KES 5,350",
      change: "+12%",
      icon: ArrowDownLeft,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
    {
      label: "Pending",
      value: "KES 2,180",
      change: "+5%",
      icon: ArrowUpRight,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
    },
    {
      label: "Tasks",
      value: "28",
      change: "+8",
      icon: Activity,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Dashboard Overview</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, Jeff
            </h1>

            <p className="mt-2 text-slate-500">
              Here's an overview of your invoices, payments and ongoing work.
            </p>
          </div>

          <button
            onClick={() => setSendOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-green-700">
            <Plus size={18} />
            Create Invoice
          </button>
        </div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main */}
          <section className="space-y-8 lg:col-span-8">
            <BalanceCard />

            {/* Stats */}
            <div className="grid gap-5 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>

                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {stat.label} this week
                  </p>

                  <div className="mt-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stat.badge}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Invoices
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest invoice activity.
                  </p>
                </div>

                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w- 250">
                  <TransactionList limit={5} showHeader={false} />
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <QuickActions onSendMoney={() => setSendOpen(true)} />

            <PaymentMethods />
          </aside>
        </div>
      </main>
      <SendMoneyDialog open={sendOpen} onOpenChange={setSendOpen} />
    </div>
  );
}

export default Dashboard