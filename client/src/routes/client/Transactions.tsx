
import { Plus, Receipt, ArrowUpRight, Wallet } from "lucide-react";
import { TransactionList } from "../../components/TransactionList";

function Transactions() {
  return (
    <section className="min-h-screen mx-auto max-w-7xl px-6 py-10 bg-slate-50">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">
              Dashboard / Transactions
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Invoice History
            </h1>

            <p className="mt-2 text-slate-500">
              Track invoices, payments and money transfers in one place.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl">
            <Plus size={18} />
            Add Invoice
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Receipt className="text-green-600" />
            </div>

            <p className="text-sm text-slate-500">Total Invoices</p>

            <h2 className="mt-1 text-3xl font-bold">128</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <ArrowUpRight className="text-blue-600" />
            </div>

            <p className="text-sm text-slate-500">Payments Received</p>

            <h2 className="mt-1 text-3xl font-bold">$24,820</h2>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <Wallet className="text-orange-600" />
            </div>

            <p className="text-sm text-slate-500">Outstanding</p>

            <h2 className="mt-1 text-3xl font-bold">$3,450</h2>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View all invoice payments and transfers.
            </p>
          </div>

          <div className="p-6">
            <TransactionList />
          </div>
        </div>
      </section>
  );
}

export default Transactions
