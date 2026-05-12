import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import toast from 'react-hot-toast';
import logo from '../../assets/bucenglogo.png';
import DashboardView from './DashboardView';
import AssignTicketsView from './AssignTicketsView';
import ReportsView from './ReportsView';
import UserManagementView from './UserManagementView';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ 
    total: 0, 
    needAction: 0, 
    inProgress: 0, 
    resolved: 0 
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeMenu === 'dashboard') fetchDashboardData();
  }, [activeMenu]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ─── Fetch all tickets from real backend ───
      const response = await ticketService.getAllTickets();
      const allTickets = response.data.tickets;

      // ─── Calculate stats from real data ───
      const total = allTickets.length;
      const needAction = allTickets.filter(t => t.status === 'Open').length;
      const inProgress = allTickets.filter(t => t.status === 'In Progress').length;
      const resolved = allTickets.filter(t => t.status === 'Resolved').length;

      setStats({ total, needAction, inProgress, resolved });
      setTickets(allTickets);

    } catch (error) {
      toast.error('Failed to load data. Make sure backend is running!');
      console.error('fetchDashboardData error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 shadow-md flex flex-col" style={{ backgroundColor: '#011787' }}>
        <div className="pt-8 pb-6 px-4 flex justify-center">
          <img src={logo} alt="Logo" className="h-50 w-auto object-contain" />
        </div>
        <nav className="flex-1 px-5 py-20 space-y-4">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'assign', label: 'Assign Tickets' },
            { id: 'reports', label: 'Reports' },
            { id: 'users', label: 'User Management' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-md transition-colors text-white ${
                activeMenu === item.id ? 'font-medium' : 'hover:bg-blue-800'
              }`}
              style={activeMenu === item.id ? { backgroundColor: '#095BBC' } : {}}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors text-red-500 hover:text-red-300 hover:bg-red-900/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-red-500"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 px-8 py-6" style={{ backgroundColor: '#FF6900' }}>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            BUCENG Complaint and Ticketing System
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'dashboard' && (
            <DashboardView
              stats={stats}
              tickets={tickets}
              loading={loading}
              onRefresh={fetchDashboardData}
              searchQuery={searchQuery}
            />
          )}
          {activeMenu === 'assign' && <AssignTicketsView />}
          {activeMenu === 'reports' && <ReportsView />}
          {activeMenu === 'users' && <UserManagementView />}
        </div>
      </main>
    </div>
  );
}