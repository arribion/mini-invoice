import { Link } from "react-router-dom"
import { Button } from "./ui/button";
import { ArrowRight, Globe, Lock, Server } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-sky-500" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/90">
            <Zap className="h-3.5 w-3.5" />
            Invoice processing made easy
          </div> */}

          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
            GT ONLINE CONSULTANTS
          </h1>

          <p className="mt-6 text-lg text-primary-foreground/70 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Thinking in systems, building for the future.
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button className="text-sky-500 bg-white shadow-button hover:brightness-110 rounded-[10px] border border-primary-foreground/20">
                Request Registration
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export function ArchitectureSection() {
  const layers = [
    {
      icon: Globe,
      title: "Create account",
      items: ["Name", "email", "phone", "password"],
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Server,
      title: "Create Invoice",
      items: ["Add Payment Gateway", "Input Invoice", "Export Invoice", "Notification Service"],
      color: "bg-success/10 text-success",
    },
    {
      icon: Lock,
      title: "Get admin update",
      items: ["Assign Pay rate", "Fullfil Payment", "Create Account", "Assign Project"],
      color: "bg-warning/10 text-warning",
    },
  ];

  return (
    <section className="py-24 sm:py-22 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-sky-500 sm:text-4xl">
            How it workS
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three-steps ensuring easy, high reliability, scalability, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {layers.map((layer, i) => (
            <div key={layer.title} className="rounded-[15px] border border-border bg-card p-6 shadow-card">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${layer.color} mb-4`}>
                <layer.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">{layer.title}</h3>
              <ul className="space-y-2">
                {layer.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {i < layers.length - 1 && (
                <div className="hidden md:flex justify-center mt-4">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 rotate-0 md:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Transaction Flow */}
        {/* <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">Transaction Flow</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "User Login",
              "JWT Auth",
              "Payment Init",
              "Balance Check",
              "Gateway Encrypt",
              "Processor Auth",
              "Bank Network",
              "Settlement",
              "Record TX",
              "Notify User",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-card-foreground shadow-card">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md gradient-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {step}
                </div>
                {i < 9 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
