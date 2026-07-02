import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Wallet, Menu, X, LayoutDashboard, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", icon: null },
  { to: "/about", label: "About", icon: LayoutDashboard },
  { to: "/contact-us", label: "Contact Us", icon: ArrowLeftRight },
  
] as const;

export function Navbar() {
   const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-slate-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] gradient-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl text-blue-500 font-bold tracking-tight">
            <span className="text-gray-500">GT</span>
            -ONLINE
          </span>
        </Link>

        <button
          onClick={() => navigate("/admin/")}
          className="text-[10px] cursor-pointer">
          Go to Admin
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={
                  location.pathname === link.to ||
                  location.pathname.startsWith(link.to)
                    ? "secondary"
                    : "ghost"
                }
                size="sm">
                {link.label}
              </Button>
            </Link>
          ))}
         
          <Link to="/login">
            <button className="bg-sky-500 shadow-card text-slate-50 rounded-3xl px-4 py-1">
              Sign In
            </button>
          </Link>
        </div>

        <button
          className="flex items-center justify-center rounded-lg p-2 text-foreground md:hidden hover:bg-accent"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link to="/client/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="hero" className="w-full mt-2">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
