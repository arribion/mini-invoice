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

import NotFoundComponent from "./components/NotFound";

const App = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="resources" element={<Resources />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Matches exactly "/admin" */}
        <Route index element={<AdminDashboard />} />

        {/* Matches "/admin/projects" */}
        <Route path="projects" element={<ManageProjects />} />

        {/* Matches "/admin/resources" (Swapped client component for admin component) */}
        <Route path="resources" element={<ManageResources />} />

        {/* Matches "/admin/settings" */}
        <Route path="settings" element={<AdminSetting />} />
      </Route>

      {/* Global Fallback (Optional but recommended) */}
      <Route path="*" element={<NotFoundComponent />} />
    </Routes>
  );
};

export default App;
