import { BugIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t flex justify-center border-border bg-sky-500">
      <div>
        <p className="text-center text-gray-50 py-2">
          Powered by arribion technologies
        </p>
        <button className="flex gap-12 mb-8 cursor-pointer text-slate-600 hover:text-slate-100">
          <BugIcon />
          REPORT A BUG
          <BugIcon />
        </button>
      </div>
    </footer>
  );
}

export default Footer