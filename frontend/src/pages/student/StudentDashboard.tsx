import React from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { getUser, logout } from '@/utils/auth';

const StudentDashboard: React.FC = () => {
  const user = getUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.full_name || 'Student'}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Courses</dt>
                      <dd className="text-lg font-medium text-gray-900">5</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Assignments</dt>
                      <dd className="text-lg font-medium text-gray-900">12</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Grades</dt>
                      <dd className="text-lg font-medium text-gray-900">85%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/student/courses" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📚</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">My Courses</h3>
              </div>
              <p className="text-gray-600">View and manage your enrolled courses</p>
            </Link>

            <Link to="/student/assignments" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">📝</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Assignments</h3>
              </div>
              <p className="text-gray-600">View and submit your assignments</p>
            </Link>

            <Link to="/student/grades" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">📊</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Grades</h3>
              </div>
              <p className="text-gray-600">Check your grades and performance</p>
            </Link>

            <Link to="/student/schedule" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📅</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Schedule</h3>
              </div>
              <p className="text-gray-600">View your class schedule</p>
            </Link>

            <Link to="/student/attendance" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 text-lg">✅</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Attendance</h3>
              </div>
              <p className="text-gray-600">Track your attendance records</p>
            </Link>

            <Link to="/student/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 text-lg">👤</span>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Profile</h3>
              </div>
              <p className="text-gray-600">Manage your personal information</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;