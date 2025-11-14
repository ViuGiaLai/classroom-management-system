import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../../assets/logo_banary.png";

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-emerald-600 text-white shadow-md flex items-center justify-between px-6">

      {/* Left - Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl overflow-hidden shadow-md bg-white/10 flex items-center justify-center">
          <img src={LogoIcon} alt="Logo" className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold">LMS</span>
          <span className="text-xs opacity-90">Learning Management System</span>
        </div>
      </div>

      {/* Right - Notifications + User Menu */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button
          className="relative p-2 rounded-lg hover:bg-white/20 transition"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14V11a6 6 0 1 0-12 0v3c0 .53-.21 1.05-.6 1.45L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/20 transition"
            onClick={toggleDropdown}
          >
            <div className="h-9 w-9 rounded-full bg-blue-600 grid place-items-center text-sm font-semibold">
              A
            </div>
            <div className="hidden sm:flex flex-col leading-tight text-left">
              <span className="text-sm font-semibold text-white">admin</span>
              <span className="text-xs text-white/80">Quản trị viên</span>
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white text-gray-700 z-20 animate-fadein origin-top-right">
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
