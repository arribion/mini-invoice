import {
  Routes, Route,
  // Navigate
} from "react-router-dom";
import Index from "./routes";
import Resources from "./routes/client/Resources";
import Transactions from "./routes/client/Transactions";
import Dashboard from "./routes/client/dashboard";
import Settings from "./routes/client/Settings";
import ClientLayout from "./layout/ClientLayout";

import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./routes/admin/AdminDashboard";
import ManageProjects from "./routes/admin/ManageProjects";
import AdminSetting from "./routes/admin/AdminSetting";
import ManageResources from "./routes/admin/ManageResources";
import ManageMembers from "./routes/admin/ManageMembers";

import NotFoundComponent from "./components/NotFound";
import About from "./routes/About";
import Login from "./routes/auth/Login";
import Register from "./routes/auth/register";
import InvoiceViewer from "./routes/client/InvoiceViewer";

const App = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="resources" element={<Resources />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/:projectID" element={<InvoiceViewer />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="resources" element={<ManageResources />} />
        <Route path="members" element={<ManageMembers />} />
        <Route path="settings" element={<AdminSetting />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<NotFoundComponent />} />
    </Routes>
  );
};

export default App;
