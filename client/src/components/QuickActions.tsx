import { Send, Download, CreditCard, QrCode } from "lucide-react";
// import { Button } from "./ui/button";

interface QuickActionsProps {
  onSendMoney: () => void;
}

export function QuickActions({ onSendMoney }: QuickActionsProps) {
  const actions = [
    {
      icon: Send,
      label: "Add Invoice",
      color: "gradient-primary",
      onClick: onSendMoney,
    },
    {
      icon: Download,
      label: "Export Invoice",
      color: "bg-success",
      onClick: () => {},
    },
    {
      icon: CreditCard,
      label: "Request Payment",
      color: "bg-warning",
      onClick: () => {},
    },
    {
      icon: QrCode,
      label: "Share Invoice",
      color: "bg-black",
      onClick: () => {},
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-1">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="group flex flex-col items-center gap-2 rounded-[10px] border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-105`}>
            <action.icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
