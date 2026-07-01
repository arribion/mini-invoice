import { BugIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t p-4 border-border bg-sky-500">
      <div>
        <p className="text-gray-50 py-4">
          {" "}
          &copy; {new Date().getFullYear()} Mini Invoice. All Rights Reserved.
        </p>
        <p className=" text-sky-300/80 py-2">Powered by arribion technologies</p>
        <button className="flex gap-4 mb-8 cursor-pointer text-slate-600 hover:text-slate-100">
          <BugIcon />
          BUG REPORT & SUGGETIONS
          <BugIcon />
        </button>
      </div>
    </footer>
  );
}

export default Footer