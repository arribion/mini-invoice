import {
  FileText,
  ExternalLink
} from "lucide-react";

export interface Transaction {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  type: "sent" | "received" | "payment";
}


// eslint-disable-next-line react-refresh/only-export-components
export const sampleTransactions: Transaction[] = [
  {
    id: "1",
    name: "Project Vox",
    description: "Tasker AI response review",
    amount: 1000.0,
    date: "",
    type: "sent",
  },
  {
    id: "2",
    name: "Hedgehog",
    description: "Monthly salary",
    amount: 4500.0,
    date: "9:00 AM",
    type: "received",
  }
];

interface TransactionListProps {
  transactions?: Transaction[];
  limit?: number;
  showHeader?: boolean;
}

export function TransactionList({ transactions = sampleTransactions, limit, showHeader = true }: TransactionListProps) {
  const items = limit ? transactions.slice(0, limit) : transactions;
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {showHeader && (
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Invoices
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track all paid invoices.
            </p>
          </div>

          <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50">
            View all
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Rate / Hour</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.map((tx) => {
              const positive = tx.amount > 0;

              return (
                <tr key={tx.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                        <FileText size={18} className="text-green-600" />
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-900">
                          {tx.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {tx.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                      Handshake
                    </span>
                  </td>

                  <td className="px-6 font-semibold">
                    <span
                      className={positive ? "text-green-600" : "text-red-600"}>
                      {positive ? "+" : "-"}$
                      {Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-6">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Paid
                    </span>
                  </td>

                  <td className="px-6 text-sm text-slate-500">Oct 16, 2026</td>

                  <td className="px-6 text-right">
                    <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-100">
                      View
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}