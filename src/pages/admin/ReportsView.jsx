// src/pages/admin/ReportsView.jsx
import React, { useState, useEffect } from 'react';

// ── Ticket Details Modal (same as DashboardView) ─────────────────────────
function TicketDetailsModal({ ticket, onClose }) {
  if (!ticket) return null;
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  const getStatusBadgeModal = (status) => {
    const colors = {
      open: 'bg-[#E6F1FB] text-[#0D457D]',
      in_progress: 'bg-[#FAEEDA] text-[#653A08]',
      resolved: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return colors[status] || colors.open;
  };
  const getPriorityDisplay = () => {
    if (ticket.status === 'open') return { text: 'normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (ticket.status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = { urgent: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800', normal: 'bg-[#EAF3DE] text-[#2A530D]' };
    return { text: ticket.priority, color: colors[ticket.priority] || colors.normal };
  };
  const priorityDisplay = getPriorityDisplay();
  return (
    <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white px-6 py-5 border-b border-slate-100 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Ticket Details</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div><div className="text-xs font-medium text-gray-400">Ticket Code</div><div className="text-sm font-semibold text-gray-800">{ticket.code}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Concern / Subject</div><div className="text-sm text-gray-700">{ticket.subject}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Category</div><div className="text-sm text-gray-700">{ticket.category}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Priority</div><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDisplay.color}`}>{priorityDisplay.text}</span></div>
              <div><div className="text-xs font-medium text-gray-400">Status</div><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeModal(ticket.status)}`}>{ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span></div>
              <div><div className="text-xs font-medium text-gray-400">Assigned to</div><div className="text-sm text-gray-700">{ticket.assignedTo || 'Unassigned'}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Submitted by</div><div className="text-sm text-gray-700">{ticket.submittedBy || 'Anonymous'}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Date Submitted</div><div className="text-sm text-gray-700">{formatDateTime(ticket.created_at)}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Last Updated</div><div className="text-sm text-gray-700">{formatDateTime(ticket.updated_at || ticket.created_at)}</div></div>
            </div>
          </div>
          {ticket.history && ticket.history.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Update History</h3>
              <div className="space-y-3">
                {ticket.history.map((entry, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{entry.action}</div>
                      {entry.details && <div className="text-xs text-gray-500">{entry.details}</div>}
                      <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.date)} by {entry.performedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Concern Description</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-100">{ticket.description || 'No description provided.'}</div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Resolution / Admin notes</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-100">{ticket.resolutionNotes || 'No resolution notes added yet.'}</div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div><div className="text-xs font-medium text-gray-400">Resolution date</div><div className="text-sm text-gray-700">{ticket.resolutionDate ? formatDate(ticket.resolutionDate) : '—'}</div></div>
              <div><div className="text-xs font-medium text-gray-400">Resolved by</div><div className="text-sm text-gray-700">{ticket.resolvedBy || '—'}</div></div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-100 flex justify-end rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition-colors shadow-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Custom Select Dropdown (reused from AssignTicketsView) ────────────────
function CustomSelect({ options, value, onChange, placeholder, minWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';
  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200">
        <span className="truncate">{selectedLabel || placeholder}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-blue-50 cursor-pointer ${value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mock Data (replace with real props later) ────────────────────────────
const MOCK_TICKETS = [
  { id: 1, code: 'TKT-2026-001', subject: 'Unclean restroom, 2nd floor', category: 'Facilities & Cleanliness', status: 'in_progress', assignedTo: 'Ms. Santos', created_at: '2026-04-30T01:00:00Z', updated_at: '2026-05-01T02:00:00Z', description: 'Restroom very dirty.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Anonymous', priority: 'high' },
  { id: 2, code: 'TKT-2026-002', subject: 'Broken AC, HR office', category: 'Facilities & Cleanliness', status: 'open', assignedTo: 'Ms. Santos', created_at: '2026-04-28T03:00:00Z', updated_at: '2026-04-29T05:30:00Z', description: 'AC not cooling.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Jane', priority: 'high' },
  { id: 3, code: 'TKT-2026-003', subject: 'Grade correction request', category: 'Academic Records', status: 'in_progress', assignedTo: 'Mr. Cruz', created_at: '2026-04-27T08:00:00Z', updated_at: '2026-05-02T10:00:00Z', description: 'Wrong grade posted.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Student', priority: 'urgent' },
  { id: 4, code: 'TKT-2026-004', subject: 'Scholarship application delay', category: 'Financial / Scholarship', status: 'open', assignedTo: 'Ms. Reyes', created_at: '2026-04-26T09:00:00Z', updated_at: '2026-04-26T09:00:00Z', description: 'Waiting for approval.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Scholarship applicant', priority: 'normal' },
  { id: 5, code: 'TKT-2026-005', subject: 'Class scheduling conflict', category: 'Enrollment / Scheduling', status: 'resolved', assignedTo: 'Ms. Santos', created_at: '2026-04-25T10:00:00Z', updated_at: '2026-05-03T11:00:00Z', description: 'Two classes overlap.', history: [], resolutionNotes: 'Resolved', resolutionDate: '2026-05-03T11:00:00Z', resolvedBy: 'Admin', submittedBy: 'Student', priority: 'high' },
];

const MOCK_STATS = {
  total: 20,
  inProgress: 20,
  pending: 20,
  resolved: 20,
};

// ── Helper: filter by date range ─────────────────────────────────────────
const isWithinDateRange = (dateString, range) => {
  const date = new Date(dateString);
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(now);
  const aWeekAgo = new Date(today);
  aWeekAgo.setDate(today.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  switch (range) {
    case 'last7days':
      return date >= aWeekAgo && date <= today;
    case 'thisMonth':
      return date >= startOfMonth && date <= today;
    case 'lastMonth':
      return date >= startOfLastMonth && date <= endOfLastMonth;
    default:
      return true;
  }
};

// ── Main Component ───────────────────────────────────────────────────────
export default function ReportsView() {
  const [tickets] = useState(MOCK_TICKETS);
  const [stats] = useState(MOCK_STATS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: 'bg-[#E6F1FB] text-[#0D457D]',
      in_progress: 'bg-[#FAEEDA] text-[#653A08]',
      resolved: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return colors[status] || colors.open;
  };

  // Extract unique staff names for filter
  const uniqueStaff = ['all', ...new Set(tickets.map(t => t.assignedTo).filter(Boolean))];

  // Apply filters
  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterStaff !== 'all' && ticket.assignedTo !== filterStaff) return false;
    if (filterDate !== 'all' && !isWithinDateRange(ticket.updated_at || ticket.created_at, filterDate)) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterStaff, filterDate]);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  // Check if any filter is active
  const hasActiveFilter = filterStatus !== 'all' || filterStaff !== 'all' || filterDate !== 'all';
  const clearFilters = () => {
    setFilterStatus('all');
    setFilterStaff('all');
    setFilterDate('all');
  };

  // Options for dropdowns
  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
  ];

  const staffOptions = uniqueStaff.map(staff => ({
    label: staff === 'all' ? 'All Staff' : staff,
    value: staff,
  }));

  const dateOptions = [
    { label: 'All Dates', value: 'all' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
  ];

  // Stats cards (similar to dashboard but with "Pending" added)
  const statCards = [
    { title: 'Total Tickets', value: stats.total, subtitle: 'All time', circleColor: '#71437D', numberColor: '#71437D', bgColor: '#F4E4F8' },
    { title: 'In progress', value: stats.inProgress, subtitle: 'Being handled', circleColor: '#FA9E01', numberColor: '#653A08', bgColor: '#FAEEDA' },
    { title: 'Pending', value: stats.pending, subtitle: 'no recent update', circleColor: '#0D457D', numberColor: '#0D457D', bgColor: '#E6F1FB' },
    { title: 'Resolved', value: stats.resolved, subtitle: 'Completed', circleColor: '#49A821', numberColor: '#2A530D', bgColor: '#EAF3DE' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and track the progress of assigned tickets.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {statCards.map((card) => (
          <div key={card.title} className="rounded-xl p-7 relative shadow-md" style={{ backgroundColor: card.bgColor }}>
            <div className="absolute top-4 right-4 w-5 h-5 rounded-full" style={{ backgroundColor: card.circleColor }}></div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">{card.title}</h3>
              <p className="text-4xl font-bold mt-1" style={{ color: card.numberColor }}>{card.value}</p>
            </div>
            <div className="absolute bottom-4 right-4">
              <p className="text-xs text-gray-600">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <CustomSelect options={statusOptions} value={filterStatus} onChange={setFilterStatus} placeholder="Status" minWidth="min-w-[150px]" />
        <CustomSelect options={staffOptions} value={filterStaff} onChange={setFilterStaff} placeholder="Staff" minWidth="min-w-[160px]" />
        <CustomSelect options={dateOptions} value={filterDate} onChange={setFilterDate} placeholder="Date" minWidth="min-w-[150px]" />
        {hasActiveFilter && (
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear filters</button>
        )}
      </div>

      {/* Ticket Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/95">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Updated</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned to</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedTickets.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-400 text-sm">No tickets found</td></tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{ticket.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ticket.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[90px] ${getStatusBadge(ticket.status)}`}>
                        {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(ticket.updated_at || ticket.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ticket.assignedTo || 'Unassigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="View ticket details"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50/30 px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Showing {filteredTickets.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} active tickets
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50">‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5 && currentPage > 3) page = currentPage - 3 + i;
              if (page > totalPages) return null;
              return <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{page}</button>;
            }).filter(Boolean)}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50">›</button>
          </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}