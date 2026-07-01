import { Link, NavLink } from "react-router-dom";
export default function SideBar() {
  // Common styles for all sidebar links
  const linkBaseStyle =
    "block px-4 py-2 rounded-[5px] transition-colors hover:bg-white/10";

  // Applies a vibrant background when the link matches the current URL
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
      name: "Tasks",
      link: "/admin/tasks",
    },
    {
      name: "Projects",
      link: "/admin/projects",
    },
    {
      name: "Resources",
      link: "/admin/resources",
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
        <h1 className="font-bold text-4xl mb-6 hover:text-sky-50">GT</h1>
      </Link>
      <nav>
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
