export default function Topbar({ title = "Tổng quan" }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Logo and Page Title Section - Now on the left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">LMS</span>
            <span className="text-xs text-gray-500">
              Learning Management System
            </span>
          </div>
        </div>
        
        {/* Page Title - Now with the logo */}
        <div className="hidden md:block">
          <h1 className="text-sm text-gray-500 font-medium">{title}</h1>
        </div>
        
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Open Sidebar"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Section - Only notification and user profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-medium">
            A
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xs font-medium text-gray-900">admin</span>
            <span className="text-xs text-gray-500">Quản trị viên</span>
          </div>
        </div>
      </div>
    </header>
  );
}