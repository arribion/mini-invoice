import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Globe, Lock, Server, Star } from "lucide-react";
import hero_background from "../assets/hero_background.jpg";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${hero_background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="absolute inset-0 bg-sky-950/70" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl mt-[5em] text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
            GT ONLINE CONSULTANTS
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Thinking in systems, building for the future.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button className="text-sky-500 bg-white shadow-button hover:brightness-110 rounded-[10px] border border-primary-foreground/20">
                Request Registration <ArrowRight className="h-5 w-5" />
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
      items: ["Name", "Email", "Phone", "Password"],
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Server,
      title: "Create Invoice",
      items: [
        "Add Payment Gateway",
        "Input Invoice",
        "Export Invoice",
        "Notification Service",
      ],
      color: "bg-success/10 text-success",
    },
    {
      icon: Lock,
      title: "Get admin update",
      items: [
        "Assign Pay rate",
        "Fulfill Payment",
        "Create Account",
        "Assign Project",
      ],
      color: "bg-warning/10 text-warning",
    },
  ];

  return (
    <section className="py-24 sm:py-22 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-sky-500 sm:text-4xl">
            How it Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps ensuring easy, reliable, scalable, and secure tasking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {layers.map((layer, i) => (
            <div
              key={layer.title}
              className="rounded-[15px] border border-border bg-card p-6 shadow-card">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${layer.color} mb-4`}>
                <layer.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                {layer.title}
              </h3>
              <ul className="space-y-2">
                {layer.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {i < layers.length - 1 && (
                <div className="hidden md:flex justify-center mt-4">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// New Features Section
export function FeaturesSection() {
  const features = [
    {
      title: "Task Automation",
      description: "Automate repetitive workflows and save hours every week.",
    },
    {
      title: "Secure Payments",
      description: "Integrated gateways with encryption and fraud protection.",
    },
    {
      title: "Scalable Projects",
      description:
        "Handle small tasks or enterprise-level projects seamlessly.",
    },
    {
      title: "Real-time Updates",
      description: "Stay informed with instant notifications and dashboards.",
    },
  ];

  return (
    <section className="py-20 bg-primary/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-sky-500 mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// New Testimonials Section
export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Jane Doe",
      role: "Startup Founder",
      feedback:
        "This platform streamlined our invoicing and project management. Highly recommend!",
    },
    {
      name: "Michael Smith",
      role: "Freelancer",
      feedback:
        "I can manage multiple clients and payments effortlessly. It’s a game-changer.",
    },
    {
      name: "Sarah Johnson",
      role: "Consultant",
      feedback:
        "Reliable, secure, and easy to use. My clients love the transparency.",
    },
  ];

  return (
    <section className="py-20 bg-accent/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-sky-500 mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">"{t.feedback}"</p>
              <h4 className="text-sm font-semibold text-card-foreground">
                {t.name}
              </h4>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
