// src/pages/admin/ReportsView.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// ── Ticket Details Modal ──────────────────────────────────────────────────
function TicketDetailsModal({ ticket, onClose }) {
  if (!ticket) return null;
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
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
      closed: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || colors.open;
  };
  const getPriorityDisplay = () => {
    if (ticket.status === 'open') return { text: 'Normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (ticket.status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', normal: 'bg-[#EAF3DE] text-[#2A530D]' };
    return { text: ticket.priority, color: colors[ticket.priority?.toLowerCase()] || colors.normal };
  };
  const priorityDisplay = getPriorityDisplay();
  const dotColors = ['bg-green-500', 'bg-blue-800', 'bg-gray-400', 'bg-purple-500', 'bg-yellow-500'];

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Ticket Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none transition-colors">✕</button>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">

          {/* LEFT: Basic Info + Update History */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Basic Information</h3>
              <div className="space-y-2">
                {[
                  { label: 'Ticket Code', value: <span className="font-semibold text-gray-800">{ticket.code}</span> },
                  { label: 'Concern/ Subject', value: ticket.subject },
                  { label: 'Category', value: ticket.category },
                  { label: 'Priority', value: <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${priorityDisplay.color}`}>{priorityDisplay.text}</span> },
                  { label: 'Status', value: <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeModal(ticket.status)}`}>{ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span> },
                  { label: 'Assigned to', value: ticket.assignedTo || 'Unassigned' },
                  { label: 'Submitted by', value: ticket.submittedBy || 'Anonymous (guest)' },
                  { label: 'Date Submitted', value: formatDateTime(ticket.created_at) },
                  { label: 'Last Updated', value: formatDateTime(ticket.updated_at || ticket.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-gray-500 shrink-0 w-32">{label}</span>
                    <span className="text-gray-800 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                </svg>
                <h3 className="text-sm font-bold text-gray-700">Update History</h3>
              </div>
              {ticket.history && ticket.history.length > 0 ? (
                <div className="space-y-4">
                  {ticket.history.map((entry, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${dotColors[idx % dotColors.length]}`} />
                        {idx < ticket.history.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 mt-1 min-h-[15px]" />
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-sm font-semibold text-gray-800">{entry.action}</p>
                        {entry.details && <p className="text-xs text-gray-500 mt-0.5">{entry.details}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(entry.date)}
                          {entry.performedBy && entry.performedBy !== 'system' && (
                            <span className="ml-1">· {entry.performedBy}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No activity recorded yet.</p>
              )}
            </div>
          </div>

          {/* RIGHT: Concern Description + Resolution Notes */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Concern Description</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 min-h-[80px]">
                {ticket.description || 'No description provided.'}
              </p>
              <button className="self-start flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
                Attachment
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex-1">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Resolution / Admin notes</h3>
              <div className="bg-white rounded-lg p-3 border border-gray-100 text-sm text-gray-600 min-h-[80px] mb-4">
                {ticket.resolutionNotes || <span className="text-gray-400 italic">No resolution notes added yet.</span>}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Resolution date</p>
                  <p className="text-sm text-gray-700">{ticket.resolutionDate ? formatDate(ticket.resolutionDate) : ''}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Resolved by</p>
                  <p className="text-sm text-gray-700">{ticket.resolvedBy || ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Custom Select Dropdown ────────────────────────────────────────────────
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

// ── Helper: filter by date range ──────────────────────────────────────────
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
    case 'last7days': return date >= aWeekAgo && date <= now;
    case 'thisMonth': return date >= startOfMonth && date <= now;
    case 'lastMonth': return date >= startOfLastMonth && date <= endOfLastMonth;
    default: return true;
  }
};

// ── Main Component ────────────────────────────────────────────────────────
export default function ReportsView() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // ── Fetch reports data from backend ──────────────────────────────────────
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/admin/reports');

      const { stats: rawStats, tickets: rawTickets } = res.data;

      // Map tickets to internal format
      const mapped = (rawTickets || []).map(t => ({
        id: t.id,
        code: t.ticket_code || 'N/A',
        subject: t.subject || 'No Subject',
        category: t.categories?.name || 'General',
        status: t.status === 'In Progress' ? 'in_progress'
              : t.status === 'Resolved' ? 'resolved'
              : t.status === 'Closed' ? 'closed'
              : 'open',
        priority: t.priority?.toLowerCase() || 'normal',
        assignedTo: t.assigned_to || '',
        submittedBy: t.submitter_email || 'Anonymous (guest)',
        created_at: t.created_at,
        updated_at: t.updated_at || t.created_at,
        description: t.description || '',
        resolutionNotes: t.resolution_notes || '',
        resolutionDate: t.status === 'Resolved' ? t.updated_at : null,
        resolvedBy: t.status === 'Resolved' ? t.assigned_to : null,
        history: t.history || []
      }));

      setTickets(mapped);
      setStats(rawStats || { total: 0, inProgress: 0, pending: 0, resolved: 0 });
    } catch (err) {
      console.error('fetchReports error:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      closed: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || colors.open;
  };

  // Build unique staff list from fetched data
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

  useEffect(() => { setCurrentPage(1); }, [filterStatus, filterStaff, filterDate]);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  const hasActiveFilter = filterStatus !== 'all' || filterStaff !== 'all' || filterDate !== 'all';
  const clearFilters = () => { setFilterStatus('all'); setFilterStaff('all'); setFilterDate('all'); };

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

  const statCards = [
    { title: 'Total Tickets', value: stats.total, subtitle: 'All time', circleColor: '#71437D', numberColor: '#71437D', bgColor: '#F4E4F8' },
    { title: 'In Progress', value: stats.inProgress, subtitle: 'Being handled', circleColor: '#FA9E01', numberColor: '#653A08', bgColor: '#FAEEDA' },
    { title: 'Pending', value: stats.pending, subtitle: 'No recent update', circleColor: '#0D457D', numberColor: '#0D457D', bgColor: '#E6F1FB' },
    { title: 'Resolved', value: stats.resolved, subtitle: 'Completed', circleColor: '#49A821', numberColor: '#2A530D', bgColor: '#EAF3DE' },
  ];

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading reports...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button onClick={fetchReports} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and track the progress of all tickets.</p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          title="Refresh data"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
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
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{ticket.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ticket.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[90px] ${getStatusBadge(ticket.status)}`}>
                        {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(ticket.updated_at || ticket.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ticket.assignedTo || <span className="text-red-400 italic">Unassigned</span>}
                    </td>
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

        {/* Pagination */}
        <div className="bg-gray-50/30 px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Showing {filteredTickets.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
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