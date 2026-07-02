import { Link, NavLink } from "react-router-dom";
export default function SideBar() {

const linkBaseStyle =
    "block px-4 py-2 rounded-[5px] transition-colors hover:bg-white/10";

const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${linkBaseStyle} bg-white/20 text-white font-medium`
      : linkBaseStyle;

const sideBarLinks = [
  {
    name: "Dashboard",
    link: "/admin",
  },
  {
    name: "Projects",
    link: "/admin/projects",
  },
  {
    name: "Tasks",
    link: "/admin/tasks",
  },
  {
    name: "Invoicing",
    link: "/admin/invoicing",
  },
  {
    name: "Instructions",
    link: "/admin/resources",
  },
  {
    name: "Financies",
    link: "/admin/financies",
  },
  {
    name: "Members",
    link: "/admin/members",
  },
  {
    name: "Settings",
    link: "/admin/settings",
  },
];
  return (
    <aside className="gradient-primary fixe shadow-card text-slate-200 w-64 min-h-screen p-4">
      <Link to="/">
        <h1 className="text-slate-50 text-2xl font-bold">GT-ONLINE</h1>
      </Link>
      <nav className="mt-[2em]">
        <ul className="space-y-2">
          {sideBarLinks.map((path, index) => (
            <li key={index}>
              <NavLink to={path.link} className={getLinkStyle}>
                {path.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
