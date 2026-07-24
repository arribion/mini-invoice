// App.tsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import Index from "./routes";
import Resources from "./routes/client/Resources";
import Invoices from "./routes/client/Invoices";
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
import InvoiceViewer from "./routes/client/InvoiceViewer";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import Payments from "./routes/client/Payments";
import Projects from "./routes/client/Projects";
import TasksLog from "./routes/client/TasksLog";
import Task from "./routes/admin/task/Task";
import Invoicing from "./routes/admin/Invoicing";
import Financies from "./routes/admin/Financies";
import MyTask from "./routes/client/MyTask";

import { Bug } from "lucide-react";

const App = () => {
  return (
    <>
      <div className="m-2">
        <span className="font-bold text-sky-500">APPLICATION IS UNDER DEVELOPMENT</span>, Your suggestions are very
        much appreciated leave a message below{" "}
        <div className="mt-6 border-t border-gray-100 pt-1">
          <a
            href="https://wa.me/254707468863?text=I would like to report a bug/suggetion in the qt-online application."
            target="_blank"
            className="block">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-emerald-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Create member login">
              <Bug size={16} />
              REPORT A BUG & SUGGETIONs
            </button>
          </a>
        </div>
      </div>
      <Routes>
        {/* Public Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>

        {/* Public Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Client Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["TASKER"]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/client/dashboard" element={<Dashboard />} />
            <Route path="/client/resources" element={<Resources />} />
            <Route path="/client/invoices" element={<Invoices />} />
            <Route
              path="/client/transactions/:projectID"
              element={<InvoiceViewer />}
            />
            <Route path="/client/tasks-log" element={<TasksLog />} />
            <Route path="/client/my-tasks" element={<MyTask />} />
            <Route path="/client/projects" element={<Projects />} />
            <Route path="/client/payments" element={<Payments />} />
            <Route path="/client/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Manager Protected Routes */}
        {/* <Route  element={<ProtectedRoute allowedRoles={["MANAGER"]} />} > */}
        {/* <Route index element={<ManagerDashboard />} /> */}
        {/* <Route path="tasks" element={<Task />} /> */}
        {/* <Route path="/client/payments" element={<Payments />} /> */}
        {/* <Route path="invoicing" element={<Invoicing />} /> */}
        {/* <Route path="projects" element={<ManageProjects />} /> */}
        {/* <Route path="resources" element={<ManageResources />} /> */}
        {/* <Route path="members" element={<ManageMembers />} /> */}
        {/* <Route path="settings" element={<ManagerSetting />} /> */}
        {/* </Route> */}

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tasks" element={<Task />} />
            <Route path="invoicing" element={<Invoicing />} />
            <Route path="financies" element={<Financies />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="resources" element={<ManageResources />} />
            <Route path="members" element={<ManageMembers />} />
            <Route path="settings" element={<AdminSetting />} />
          </Route>
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
    </>
  );
};

export default App;
