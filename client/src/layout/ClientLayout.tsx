import { Link, NavLink, Outlet } from "react-router-dom";
import ClientHeader from "../components/client/ClientHeader";
const linkBaseStyle =
    "block px-4 py-2 rounded-[5px] transition-colors hover:bg-white/10";

const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${linkBaseStyle} bg-white/20 text-white font-medium`
      : linkBaseStyle;
const clientLinks = [
  {
    id: 1,
    path: "Dashboard",
    link: "/client/dashboard",
  },
  {
    id: 1,
    path: "Projects",
    link: "/client/projects"
  },
  {
    id: 1,
    path: "Task Log",
    link: "/client/tasks",
  },
  {
    id: 1,
    path: "Invoices",
    link: "/client/invoices"
  },
  {
    id: 1,
    path: "Payments",
    link: "/client/payments"
  },
  {
    id: 1,
    path: "Resources",
    link: "/client/resources",
  },
];
const ClientLayout = () => {
  return (
    <>
      <div className="flex  text-slate-50">
        <aside className="gradient-primary h-screen p-3 w-0 md:w-0 lg:w-62.5">
          <Link to="/">
            <h1 className="text-slate-50 text-2xl font-bold">GT-ONLINE</h1>
          </Link>

          <nav className="mt-[2em]">
            <ul>
              {clientLinks.map((path, index) => (
                <NavLink to={path.link} key={path.id} className={getLinkStyle}>
                  <li key={index}>{path.path}</li>
                </NavLink>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="w-full">
          <ClientHeader />
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default ClientLayout