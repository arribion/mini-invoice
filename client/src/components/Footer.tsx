import { Mail, Phone, Globe, Bug } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border gradient-primary text-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About Us</h3>
          <p className="text-sky-100 text-sm">GT Tasking Consultation.</p>
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
        <div className="mt-6 border-t border-gray-100 pt-4">
          <a
            href="https://wa.me/254707468863?text=I would like to report a bug in the qt-online application."
            target="_blank"
            className="block">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-emerald-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Create member login">
              <Bug size={16} />
              REPORT A BUG & SUGGETIONs
            </button>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;