// src/pages/staff/StaffDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/bucenglogo.png';

// ── Custom Select (used in modal status dropdown and history filters) ───
function CustomSelect({ options, value, onChange, placeholder, minWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';
  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200">
        <span className="truncate">{selectedLabel || placeholder}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-blue-50 cursor-pointer ${value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Success Modal ──────────────────────────────────────────────────────
function SuccessModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-green-100 bg-green-50">
          <h3 className="text-lg font-semibold text-green-700">✓ Success</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm">OK</button>
        </div>
      </div>
    </div>
  );
}

// ── Staff Ticket Details Modal (Resolution Notes always required) ─────
function StaffTicketDetailsModal({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
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

  const getPriorityBadge = (priority, status) => {
    if (status === 'open') return { text: 'normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return { text: priority, color: colors[priority] || colors.normal };
  };
  const priorityDisplay = getPriorityBadge(ticket.priority, ticket.status);

  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' }
  ];

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      setValidationError('Resolution notes are required.');
      return;
    }
    setValidationError('');
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onUpdate(ticket.id, { status, resolutionNotes });
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{ticket.code}</h2>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">✕</button>
          </div>
          <div className="px-6 py-6 space-y-6">
            {/* Ticket Information */}
            <div>
              <h3 className="text-md font-bold text-gray-800 mb-3">Ticket Information</h3>
              <p className="text-gray-700 text-sm mb-2">{ticket.subject}</p>
              <div className="flex gap-2 mb-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                  {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityDisplay.color}`}>
                  {priorityDisplay.text}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div><div className="text-gray-500">Ticket Code</div><div className="font-medium">{ticket.code}</div></div>
                <div><div className="text-gray-500">Category</div><div className="font-medium">{ticket.category}</div></div>
                <div><div className="text-gray-500">Assigned to</div><div className="font-medium">{ticket.assignedTo} <span className="text-xs text-gray-400">(you)</span></div></div>
                <div><div className="text-gray-500">Submitted by</div><div className="font-medium">{ticket.submittedBy || 'Anonymous'}</div></div>
                <div><div className="text-gray-500">Date Submitted</div><div className="font-medium">{formatDateTime(ticket.created_at)}</div></div>
                <div><div className="text-gray-500">Last Updated</div><div className="font-medium">{formatDateTime(ticket.updated_at || ticket.created_at)}</div></div>
              </div>
            </div>
            {/* Concern Description */}
            <div>
              <h3 className="text-md font-bold text-gray-800 mb-2">Concern Description</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-100">{ticket.description || 'No description provided.'}</div>
            </div>
            {/* Update Ticket Section */}
            <div>
              <h3 className="text-md font-bold text-gray-800 mb-2">Update Ticket</h3>
              <p className="text-xs text-gray-500 mb-3">You can only update status and add resolution notes. Only Admin can reassign tickets.</p>
              <form onSubmit={handleSubmitClick} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <CustomSelect options={statusOptions} value={status} onChange={setStatus} placeholder="Select status" minWidth="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution Notes <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-200 focus:border-blue-400 resize-none ${
                      validationError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the action taken or resolution details (required)"
                  />
                  {validationError && <p className="text-xs text-red-500 mt-1">{validationError}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg shadow-sm">Update</button>
                </div>
              </form>
            </div>
            {/* Activity Timeline */}
            {ticket.history && ticket.history.length > 0 && (
              <div>
                <h3 className="text-md font-bold text-gray-800 mb-3">Activity Timeline</h3>
                <div className="space-y-3">
                  {ticket.history.map((entry, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{entry.action}</div>
                        {entry.details && <div className="text-xs text-gray-500">{entry.details}</div>}
                        <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(entry.date)} {entry.performedBy ? `by ${entry.performedBy}` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="text-lg font-semibold text-gray-800">Confirm Update</h3></div>
            <div className="px-6 py-4"><p className="text-sm text-gray-600">Are you sure you want to update this ticket?</p></div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg shadow-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} message="Ticket updated successfully!" />
    </>
  );
}

// ── Mock data (tickets with history) ─────────────────────────────────────
const MOCK_MY_TICKETS = [
  { id: 1, code: 'TKT-2026-ZBYPIG', subject: 'Unclean restroom on 2nd floor', category: 'Facilities & Cleanliness', status: 'in_progress', priority: 'urgent', assignedTo: 'Ms. Sarah Santos', created_at: '2026-04-30T01:00:00Z', updated_at: '2026-05-02T02:00:00Z', description: 'The 2nd floor restroom super dirty like kadiri.', history: [
    { action: 'Ticket Submitted', details: '', date: '2026-04-30T00:00:00Z', performedBy: 'system' },
    { action: 'Assigned to Ms. Sarah Santos', details: '', date: '2026-04-30T02:15:00Z', performedBy: 'Admin' },
    { action: 'Status → In progress', details: '', date: '2026-04-30T02:20:00Z', performedBy: 'Ms. Santos' },
  ], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Anonymous (guest)' },
  { id: 2, code: 'TKT-2026-002', subject: 'Broken AC, HR office', category: 'Facilities & Cleanliness', status: 'open', priority: 'normal', assignedTo: 'Ms. Santos', created_at: '2026-05-03T03:00:00Z', updated_at: '2026-05-04T05:30:00Z', description: 'AC not cooling.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Jane' },
  { id: 3, code: 'TKT-2026-003', subject: 'Grade correction request', category: 'Academic Records', status: 'in_progress', priority: 'urgent', assignedTo: 'Ms. Santos', created_at: '2026-04-28T08:00:00Z', updated_at: '2026-05-06T10:00:00Z', description: 'Wrong grade posted.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Student' },
  { id: 4, code: 'TKT-2026-004', subject: 'Scholarship application delay', category: 'Financial / Scholarship', status: 'resolved', priority: 'normal', assignedTo: 'Ms. Santos', created_at: '2026-05-07T09:00:00Z', updated_at: '2026-05-08T11:00:00Z', description: 'Waiting for approval.', history: [], resolutionNotes: 'Approved', resolutionDate: '2026-05-08', resolvedBy: 'Admin', submittedBy: 'Scholarship applicant' },
  { id: 5, code: 'TKT-2026-005', subject: 'Class scheduling conflict', category: 'Enrollment / Scheduling', status: 'open', priority: 'normal', assignedTo: 'Ms. Santos', created_at: '2026-04-29T10:00:00Z', updated_at: '2026-04-29T12:00:00Z', description: 'Two classes overlap.', history: [], resolutionNotes: '', resolutionDate: null, resolvedBy: null, submittedBy: 'Student' },
];

// ── Main Dashboard Tab (cards, filters, pagination) ──────────────────────
function MyDashboard({ tickets, stats }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusBadge = (status) => {
    const colors = {
      open: 'bg-[#E6F1FB] text-[#0D457D]',
      in_progress: 'bg-[#FAEEDA] text-[#653A08]',
      resolved: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return colors[status] || colors.open;
  };

  const getPriorityBadge = (priority, status) => {
    if (status === 'open') return { text: 'normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return { text: priority, color: colors[priority] || colors.normal };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const urgentCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;
  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const filteredTickets = tickets.filter(ticket => statusFilter === 'all' || ticket.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setCurrentPage(1), [statusFilter]);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  const statCards = [
    { title: 'Assigned to me', value: stats.total, subtitle: 'Total Tickets', circleColor: '#71437D', numberColor: '#71437D', bgColor: '#F4E4F8' },
    { title: 'Pending Action', value: stats.open + stats.inProgress, subtitle: 'Open or In progress', circleColor: '#FA9E01', numberColor: '#653A08', bgColor: '#FAEEDA' },
    { title: 'Resolved', value: stats.resolved, subtitle: 'Completed', circleColor: '#49A821', numberColor: '#2A530D', bgColor: '#EAF3DE' },
  ];

  const handleUpdateTicket = (ticketId, updatedData) => {
    console.log('Update ticket', ticketId, updatedData);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {statCards.map((card) => (
          <div key={card.title} className="rounded-xl p-7 relative shadow-md" style={{ backgroundColor: card.bgColor }}>
            <div className="absolute top-4 right-4 w-5 h-5 rounded-full" style={{ backgroundColor: card.circleColor }}></div>
            <div><h3 className="text-sm font-medium text-gray-700">{card.title}</h3><p className="text-4xl font-bold mt-1" style={{ color: card.numberColor }}>{card.value}</p></div>
            <div className="absolute bottom-4 right-4"><p className="text-xs text-gray-600">{card.subtitle}</p></div>
          </div>
        ))}
      </div>

      {urgentCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p className="text-red-700 font-medium"> You have {urgentCount} urgent ticket{urgentCount > 1 ? 's' : ''} that need immediate attention.</p>
        </div>
      )}

      <div><h2 className="text-xl font-semibold text-gray-800">Tickets assigned to me</h2></div>

      <div className="flex flex-wrap items-center gap-4">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'open', label: 'Open', count: counts.open },
          { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
          { key: 'resolved', label: 'Resolved', count: counts.resolved },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              statusFilter === tab.key ? 'bg-gray-100 text-gray-800 border border-gray-300' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
              statusFilter === tab.key ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-600'
            }`}>{tab.count}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {paginatedTickets.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No tickets found</div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginatedTickets.map((ticket) => {
            const statusBadge = getStatusBadge(ticket.status);
            const priority = getPriorityBadge(ticket.priority, ticket.status);
            return (
              <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-bold text-gray-800">{ticket.code}</h3>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
                    {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priority.color}`}>{priority.text}</span>
                  <span className="text-xs text-gray-500">{ticket.category}</span>
                  <span className="text-xs text-gray-400 ml-auto">{formatDate(ticket.updated_at || ticket.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="bg-gray-50/30 px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">Showing {filteredTickets.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets</div>
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
      )}

      {selectedTicket && <StaffTicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onUpdate={handleUpdateTicket} />}
    </div>
  );
}

// ── Enhanced History Log Component (with Action + Date filters) ─────────
function HistoryLog() {
  // Mock data for history (self-contained)
  const [history, setHistory] = useState([
    { id: 1, action: 'Ticket assigned to you', details: 'TKT-2026-001 – Unclean restroom', date: '2026-05-01T10:00:00Z', performedBy: 'Admin' },
    { id: 2, action: 'Status updated', details: 'TKT-2026-001 changed from Open to In Progress', date: '2026-05-02T14:30:00Z', performedBy: 'Admin' },
    { id: 3, action: 'Resolution added', details: 'TKT-2026-004 – Scholarship delay resolved', date: '2026-05-08T09:15:00Z', performedBy: 'Admin' },
    { id: 4, action: 'New ticket assigned', details: 'TKT-2026-005 – Class scheduling conflict', date: '2026-05-09T08:00:00Z', performedBy: 'Admin' },
    { id: 5, action: 'Ticket resolved', details: 'TKT-2026-004 marked as resolved', date: '2026-05-08T10:00:00Z', performedBy: 'System' },
    { id: 6, action: 'Priority changed', details: 'TKT-2026-006 set to High', date: '2026-05-02T09:00:00Z', performedBy: 'Admin' },
  ]);
  const [filterAction, setFilterAction] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper: filter by date range
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
      case 'last7days': return date >= aWeekAgo && date <= today;
      case 'thisMonth': return date >= startOfMonth && date <= today;
      case 'lastMonth': return date >= startOfLastMonth && date <= endOfLastMonth;
      default: return true;
    }
  };

  const actionTypes = ['all', ...new Set(history.map(h => h.action))];
  const actionOptions = actionTypes.map(act => ({ label: act === 'all' ? 'All Actions' : act, value: act }));
  const dateOptions = [
    { label: 'All Dates', value: 'all' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
  ];

  const filteredHistory = history.filter(item => {
    if (filterAction !== 'all' && item.action !== filterAction) return false;
    if (filterDate !== 'all' && !isWithinDateRange(item.date, filterDate)) return false;
    return true;
  });
  const hasActiveFilter = filterAction !== 'all' || filterDate !== 'all';
  const clearFilters = () => { setFilterAction('all'); setFilterDate('all'); };

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  useEffect(() => setCurrentPage(1), [filterAction, filterDate]);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-800">History Log</h1><p className="text-sm text-gray-500 mt-1">Track all your activities and ticket updates</p></div>

      {/* Filter bar with Action + Date */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <CustomSelect options={actionOptions} value={filterAction} onChange={setFilterAction} placeholder="Action" minWidth="min-w-[160px]" />
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-600">Date:</span>
          <CustomSelect options={dateOptions} value={filterDate} onChange={setFilterDate} placeholder="Date" minWidth="min-w-[150px]" />
        </div>
        {hasActiveFilter && <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear filters</button>}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/95">
              <tr>
                <th className="w-1/4 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="w-2/5 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedHistory.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-gray-400 text-sm">No history entries found</td></tr>
              ) : (
                paginatedHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 break-words">{item.details}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDateTime(item.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.performedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-gray-50/30 px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Showing {filteredHistory.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} entries
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
    </div>
  );
}

// ── Main StaffDashboard (sidebar, top bar, tab switching) ────────────────
export default function StaffDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 shadow-md flex flex-col" style={{ backgroundColor: '#011787' }}>
        <div className="pt-8 pb-6 px-4 flex justify-center"><img src={logo} alt="Logo" className="h-16 w-auto object-contain" /></div>
        <nav className="flex-1 px-5 py-10 space-y-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2.5 rounded-md transition-colors text-white ${activeTab === 'dashboard' ? 'font-medium' : 'hover:bg-blue-800'}`} style={activeTab === 'dashboard' ? { backgroundColor: '#095BBC' } : {}}>My Dashboard</button>
          <button onClick={() => setActiveTab('history')} className={`w-full text-left px-4 py-2.5 rounded-md transition-colors text-white ${activeTab === 'history' ? 'font-medium' : 'hover:bg-blue-800'}`} style={activeTab === 'history' ? { backgroundColor: '#095BBC' } : {}}>History Log</button>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors text-red-400 hover:text-red-300 hover:bg-red-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 px-8 py-6" style={{ backgroundColor: '#FF6900' }}>
          <h1 className="text-2xl font-bold text-white tracking-wide">BUCENG Complaint and Ticketing System</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <MyDashboard
              tickets={MOCK_MY_TICKETS}
              stats={{
                total: MOCK_MY_TICKETS.length,
                open: MOCK_MY_TICKETS.filter(t => t.status === 'open').length,
                inProgress: MOCK_MY_TICKETS.filter(t => t.status === 'in_progress').length,
                resolved: MOCK_MY_TICKETS.filter(t => t.status === 'resolved').length,
              }}
            />
          )}
          {activeTab === 'history' && <HistoryLog />}
        </div>
      </main>
    </div>
  );
}