import React, { useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Customers', path: '/customers', roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Products', path: '/products', roles: ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'] },
    { label: 'Inventory', path: '/inventory', roles: ['ADMIN', 'WAREHOUSE'] },
    { label: 'Challans', path: '/challans', roles: ['ADMIN', 'SALES'] },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-lg font-bold">Fundsroom</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              title={sidebarOpen ? '' : item.label}
            >
              <span className="text-lg">→</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            {sidebarOpen ? 'Logout' : '✕'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Fundsroom ERP Portal</h2>
          <div className="text-right text-sm text-gray-600">
            <p>{user?.name}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
