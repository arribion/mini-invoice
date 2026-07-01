import { Link, Outlet } from "react-router-dom"
import ClientHeader from "../components/client/ClientHeader";

const ClientLayout = () => {
  return (
    <>
      <div className="flex  text-slate-50">
        <aside className="bg-primary p-3 w-0 md:w-0 lg:w-[250px]">
          <Link to="/">
            <h1 className="text-sky-500 font-bold">Go back</h1>
          </Link>

          <nav>side bar</nav>
        </aside>
        <main className="w-full">
          <ClientHeader/>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default ClientLayout