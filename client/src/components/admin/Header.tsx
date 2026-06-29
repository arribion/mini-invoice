import { Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, manage your projects efficiently.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 outline-none transition focus:border-green-500 focus:bg-white"
          />
        </div>

        {/* Notification */}
        <button className="relative rounded-xl p-2 transition hover:bg-gray-100">
          <Bell size={22} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <button className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
            JM
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-gray-900">Jeff Mutethia</p>

            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
