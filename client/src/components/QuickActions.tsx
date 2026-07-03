import { Send, Download, CreditCard, QrCode } from "lucide-react";
import { Link } from "react-router-dom";


export function QuickActions() {
  const actions = [
    {
      icon: Send,
      label: "Log Task",
      color: "gradient-primary",
      link: "/client/tasks",
    },
    {
      icon: Download,
      label: "Export Task",
      color: "bg-success",
      link: "#",
    },
    {
      icon: CreditCard,
      label: "Request Payment",
      color: "bg-warning",
      link: "#",
    },
    {
      icon: QrCode,
      label: "Share Task",
      color: "bg-black",
      link: "#",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-1">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.link}
          className="group flex flex-col items-center gap-4 rounded-[10px] border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
          <button>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-105`}>
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {action.label}
            </span>
          </button>
        </Link>
      ))}
    </div>
  );
}
