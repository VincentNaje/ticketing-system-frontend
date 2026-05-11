// src/pages/staff/StaffLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/bucenglogo.png';

export default function StaffLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/staff/dashboard', label: '📊 My Dashboard' },
    { path: '/staff/history', label: '📜 History Log' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-[#011787] shadow-md transition-transform duration-300 z-30 lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="p-4 border-b border-blue-800 flex justify-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-2 rounded-md transition-colors text-white ${location.pathname === item.path ? 'bg-[#095BBC] font-medium' : 'hover:bg-blue-800'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors">
            🚪 Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex items-center lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="ml-4 flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="font-semibold">Staff Portal</span>
          </div>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}