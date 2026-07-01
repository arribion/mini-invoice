import { useState } from "react";
import {
  Settings,
  Building2,
  Mail,
  Phone,
  Globe,
  Save,
  User,
  Lock,
  ShieldCheck,
} from "lucide-react";

const AdminSetting = () => {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "Arribion Technologies",
    contactEmail: "admin@example.com",
    supportPhone: "+254700000000",
    websiteUrl: "https://example.com",
    maintenanceMode: false,

    // Admin Account
    adminName: "Jeff Mutethia",
    username: "admin",
    adminEmail: "admin@example.com",

    // Password Change
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      settings.newPassword &&
      settings.newPassword !== settings.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /*
      await axios.put("/admin/settings", {
        companyName: settings.companyName,
        contactEmail: settings.contactEmail,
        supportPhone: settings.supportPhone,
        websiteUrl: settings.websiteUrl,
        maintenanceMode: settings.maintenanceMode,
      });

      await axios.put("/admin/profile", {
        adminName: settings.adminName,
        username: settings.username,
        adminEmail: settings.adminEmail,
        currentPassword: settings.currentPassword,
        newPassword: settings.newPassword,
      });
      */

      console.log(settings);

      alert("Settings updated successfully.");

      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="text-green-600" size={30} />
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        </div>

        <p className="mt-2 text-gray-600">
          Manage your application settings and administrator account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================== GENERAL SETTINGS ================== */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Settings size={24} className="text-green-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                General Settings
              </h2>
              <p className="text-sm text-gray-500">
                Configure your application information.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Building2 size={16} />
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail size={16} />
                Contact Email
              </label>

              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone size={16} />
                Support Phone
              </label>

              <input
                type="text"
                name="supportPhone"
                value={settings.supportPhone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Globe size={16} />
                Website URL
              </label>

              <input
                type="url"
                name="websiteUrl"
                value={settings.websiteUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500"
              />
            </div>
          </div>

          {/* Maintenance */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Maintenance Mode
                </h3>

                <p className="text-sm text-gray-500">
                  Prevent users from accessing the application while maintenance
                  is in progress.
                </p>
              </div>

              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-5 w-5"
              />
            </div>
          </div>
        </div>

        {/* ================== ACCOUNT SETTINGS ================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck size={24} className="text-green-600" />

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Account & Security
              </h2>

              <p className="text-sm text-gray-500">
                Update your administrator account and login credentials.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <User size={16} />
                Full Name
              </label>

              <input
                name="adminName"
                value={settings.adminName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 text-sm font-medium">Username</label>

              <input
                name="username"
                value={settings.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Mail size={16} />
                Login Email
              </label>

              <input
                type="email"
                name="adminEmail"
                value={settings.adminEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>
          </div>

          <hr className="my-8" />

          <h3 className="mb-5 text-lg font-semibold">Change Password</h3>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Current Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Lock size={16} />
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={settings.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Lock size={16} />
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={settings.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Lock size={16} />
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={settings.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Save size={18} />

            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSetting;
