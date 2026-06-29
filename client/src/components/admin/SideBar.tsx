import { NavLink } from "react-router-dom";
export default function SideBar() {
  // Common styles for all sidebar links
  const linkBaseStyle =
    "block px-4 py-2 rounded-lg transition-colors hover:bg-white/10";

  // Applies a vibrant background when the link matches the current URL
  const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${linkBaseStyle} bg-white/20 text-white font-medium`
      : linkBaseStyle;

  return (
    <aside className="gradient-primary shadow-card text-slate-200 w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/admin/projects" className={getLinkStyle}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/resources" className={getLinkStyle}>
              Resources
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings" className={getLinkStyle}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
