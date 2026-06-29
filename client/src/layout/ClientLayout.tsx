import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import Footer from "../components/Footer"

const ClientLayout = () => {
  return (
      <>
          <Navbar />
          <main> 
            <Outlet />
          </main>
          <Footer/>
      </>
  )
}

export default ClientLayout