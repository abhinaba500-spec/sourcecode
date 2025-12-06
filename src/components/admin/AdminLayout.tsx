import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { LayoutDashboard, LogOut, Home } from 'lucide-react';

export const AdminLayout = () => {
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the secret login path if not authenticated
    return <Navigate to="/admin8240152131" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Gravity Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl text-white">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-colors">
            <Home className="w-5 h-5" /> View Site
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 w-full rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
