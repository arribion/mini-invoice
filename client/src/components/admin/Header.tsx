import { Bell, LogOut, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const Header = () => {
  const [showMiniProfileCard, setShowMiniProfileCard] = useState(false);
  const navigate = useNavigate();

  const toggleMiniProfileCard = () => {
    setShowMiniProfileCard(!showMiniProfileCard);
  }
  // Move your click handler inside the component
  const handleLogout = () => {
    navigate("/logout", {
      replace: true,
    });
  };



  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-sky-500">Admin Dashboard</h1>
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
        <button
          onClick={toggleMiniProfileCard}
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100 relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
            JM
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-gray-900">Jeff Mutethia</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div>
            {showMiniProfileCard && (
              <nav className="absolute left-0 top-15 shadow-lg rounded bg-white p-2">
                <ul>
                  <li className="flex gap-2 items-center">
                    <User size={14} />
                    Account
                  </li>
                  <Link to="/">
                    <li
                      onClick={handleLogout}
                      className="flex gap-2 hover:bg-gray-100 cursor-pointer items-center">
                      <LogOut size={14} />
                      Logout
                    </li>
                  </Link>
                </ul>
              </nav>
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
