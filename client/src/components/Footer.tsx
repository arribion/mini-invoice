import { BugIcon, Mail, Phone, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border gradient-primary text-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About Us</h3>
          <p className="text-sky-100 text-sm">
            GT Tasking Consultation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-sky-100">
            <li>
              <a href="/about" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-sky-100">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> support@arribion.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +254 700 000 000
            </li>
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> www.arribion.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sky-400 mt-8 px-6 py-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-sky-100">
          &copy; {new Date().getFullYear()} GT. All Rights Reserved.
        </p>
        <p className="text-sm text-sky-200">Powered by Arribion Technologies</p>
        <button className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-sm font-medium">
          <BugIcon className="h-4 w-4" />
          Bug Report & Suggestions
        </button>
      </div>
    </footer>
  );
}

export default Footer;