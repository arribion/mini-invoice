import { Outlet } from "react-router-dom";
import SideBar from "../components/admin/SideBar";

const AdminLayout = () => {
    return (
        <>
            <div className="flex">
                <SideBar/>
                <main>
                    <Outlet/>
                </main>
            </div>
      </>
  )
}

export default AdminLayout