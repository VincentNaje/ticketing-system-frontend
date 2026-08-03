import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// ── Ticket Details Modal (solid header background) ───────────────────────
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

// ── Custom Select Dropdown (same as used in filters) ─────────────────────
function CustomSelect({ options, value, onChange, placeholder, minWidth, disabled }) {
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

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button 
        onClick={handleToggle} 
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        {!disabled && (
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
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

// ── Confirmation Modal Component ─────────────────────────────────────────
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 whitespace-pre-line">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Success Modal Component ──────────────────────────────────────────────
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
          <button onClick={onClose} className="px-4 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Update Ticket Modal (with confirmation & success modals) ──────────────
function UpdateTicketModal({ ticket, staffList, onUpdate, onClose }) {
  const [assignTo, setAssignTo] = useState(ticket.assignedTo || '');
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || '');
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // 'update' or 'resolve'

  if (!ticket) return null;

  const staffOptions = [
    { label: 'Unassigned', value: '' },
    ...staffList.map(s => ({ label: s.name, value: s.name }))
  ];
  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' }
  ];
  const priorityOptions = [
    { label: 'Urgent', value: 'urgent' },
    { label: 'High', value: 'high' },
    { label: 'Normal', value: 'normal' }
  ];

  const isReadOnly = ticket.status === 'resolved' || ticket.status === 'closed';

  const handleUpdateClick = () => {
    if (isReadOnly) return;
    setPendingAction('update');
    setShowConfirm(true);
  };

  const handleMarkResolvedClick = () => {
    setPendingAction('resolve');
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (pendingAction === 'update') {
      onUpdate(ticket.id, { assignTo, status, priority, resolutionNotes });
      setSuccessMessage('Ticket updated successfully!');
    } else if (pendingAction === 'resolve') {
      onUpdate(ticket.id, {
        assignTo,
        status: 'resolved',
        priority: 'normal',
        resolutionNotes: resolutionNotes || 'Marked as resolved.',
        resolvedBy: 'Admin',
        resolutionDate: new Date().toISOString(),
      });
      setSuccessMessage('Ticket marked as resolved!');
    }
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose(); // close the update modal after success
  };

  const getConfirmationMessage = () => {
    if (pendingAction === 'update') return 'Are you sure you want to update this ticket?';
    if (pendingAction === 'resolve') return 'Are you sure you want to mark this ticket as resolved?\n\nThis will set status to Resolved, priority to Normal, and add a resolution date.';
    return '';
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {isReadOnly ? 'Ticket Details (Resolved)' : 'Update Ticket'}
              </h2>
              <p className="text-sm font-bold text-[#095BBC] mt-1 text-left">{ticket.code}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Assign to</label>
                <CustomSelect options={staffOptions} value={assignTo} onChange={setAssignTo} placeholder="Select staff" minWidth="w-full" disabled={isReadOnly} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</label>
                <CustomSelect options={statusOptions} value={status} onChange={setStatus} placeholder="Select status" minWidth="w-full" disabled={isReadOnly} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Priority</label>
              <CustomSelect options={priorityOptions} value={priority} onChange={setPriority} placeholder="Select priority" minWidth="w-full" disabled={isReadOnly} />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Resolution Notes</label>
              <textarea
                rows={2}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                disabled={isReadOnly}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none ${isReadOnly ? 'bg-gray-50 opacity-70 cursor-not-allowed' : ''}`}
                placeholder={isReadOnly ? 'No notes' : 'Describe how it was resolved'}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                View Activity log
              </button>
              {showActivityLog && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 max-h-40 overflow-y-auto border border-gray-200">
                  {ticket.history && ticket.history.length > 0 ? (
                    ticket.history.map((h, i) => (
                      <div key={i} className="mb-2 pb-2 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                        <div className="font-semibold text-gray-700">{h.action}</div>
                        {h.details && <div className="text-gray-500">{h.details}</div>}
                        <div className="text-gray-400 text-[10px] mt-0.5">
                          {new Date(h.date).toLocaleString()} by {h.performedBy}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">No activity yet.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {!isReadOnly && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
              <button onClick={handleUpdateClick} className="px-5 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm">
                Update
              </button>
              <button onClick={handleMarkResolvedClick} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition shadow-sm">
                Mark resolved
              </button>
            </div>
          )}
          {isReadOnly && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
              <button onClick={onClose} className="px-5 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm">
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message={getConfirmationMessage()}
        confirmText={pendingAction === 'update' ? 'Update' : 'Resolve'}
        cancelText="Cancel"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        message={successMessage}
      />
    </>
  );
}


export default function AssignTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Fetch tickets and staff from the backend
  useEffect(() => {
    fetchTicketsAndStaff();
  }, []);

  const fetchTicketsAndStaff = async () => {
    try {
      setLoading(true);

      // Run both API calls at the same time using the shared api instance (token auto-attached)
      const [ticketsRes, staffRes] = await Promise.all([
        api.get('/api/admin/tickets'),
        api.get('/api/admin/staff')
      ]);

      // Backend returns { success, tickets: [...] }
      const safeTickets = Array.isArray(ticketsRes.data.tickets) ? ticketsRes.data.tickets : [];
      const mappedTickets = safeTickets.map(t => {
        if (!t) return null;
        return {
          id: t.id,
          code: t.ticket_code || 'N/A',
          subject: t.subject || 'No Subject provided',
          category: t.categories?.name || 'General',
          status: typeof t.status === 'string'
            ? (t.status === 'In Progress' ? 'in_progress' : t.status === 'Resolved' ? 'resolved' : t.status === 'Closed' ? 'closed' : 'open')
            : 'open',
          priority: typeof t.priority === 'string' ? t.priority.toLowerCase() : 'normal',
          assignedTo: t.assigned_to || '',
          submittedBy: t.submitter_email || 'Anonymous (guest)',
          created_at: t.created_at || new Date().toISOString(),
          updated_at: t.updated_at || t.created_at || new Date().toISOString(),
          description: t.description || 'No description provided.',
          resolutionNotes: t.resolution_notes || '',
          resolutionDate: t.status === 'Resolved' ? t.updated_at : null,
          resolvedBy: t.status === 'Resolved' ? t.assigned_to : null,
          history: t.history || []
        };
      }).filter(Boolean);

      setTickets(mappedTickets);

      // Backend returns { success, staff: [...] } with full_name field
      const safeStaff = Array.isArray(staffRes.data.staff) ? staffRes.data.staff : [];
      setStaffList(safeStaff.map(s => ({
        id: s.id,
        name: s.full_name
      })));

    } catch (error) {
      console.error('Error fetching assignment data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Send the update to your Express backend
  const handleUpdateTicket = async (ticketId, updatedData) => {
    try {
      // Convert internal status keys back to DB format
      const payload = {
        assigned_to: updatedData.assignTo || null,
        status: updatedData.status === 'in_progress' ? 'In Progress'
              : updatedData.status === 'resolved' ? 'Resolved'
              : 'Open',
        priority: updatedData.priority,
        resolution_notes: updatedData.resolutionNotes || null
      };

      await api.put(`/api/admin/tickets/${ticketId}`, payload);

      // Refresh data to pull new history logs
      await fetchTicketsAndStaff();

      setShowUpdateModal(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
      const msg = error.response?.data?.message || 'Failed to update ticket. Please try again.';
      alert(msg);
    }
  };

  const categoryOptions = ['all', 'Academic Records', 'Faculty / Instructor', 'Enrollment / Scheduling', 'Facilities & Cleanliness', 'Administrative Process', 'Financial / Scholarship', 'Others / General'];
  const statusOptions = ['all', 'open', 'in_progress', 'resolved'];
  const priorityOptions = ['all', 'urgent', 'high', 'normal'];

  const filteredTickets = tickets.filter(ticket => {
    if (filterCategory !== 'all' && ticket.category !== filterCategory) return false;
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  // Hook must stay above the early loading return
  useEffect(() => setCurrentPage(1), [filterCategory, filterStatus, filterPriority]);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowUpdateModal(true);
  };

  const openDetailsModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const hasActiveFilter = filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all';

  const getStatusBadge = (status) => {
     const colors = {
      open: 'bg-[#E6F1FB] text-[#0D457D]',
      in_progress: 'bg-[#FAEEDA] text-[#653A08]',
      resolved: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return colors[status] || colors.open;
  };

  const getPriorityDisplay = (ticket) => {
    if (ticket.status === 'open') return { text: 'normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (ticket.status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-[#EAF3DE] text-[#2A530D]',
    };
    return { text: ticket.priority, color: colors[ticket.priority] || colors.normal };
  };

  // Safe loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assign Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">Assign unassigned tickets to staff members.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {/* Category dropdown */}
        <CustomSelect options={categoryOptions.map(c => ({ label: c === 'all' ? 'All Categories' : c, value: c }))} value={filterCategory} onChange={setFilterCategory} placeholder="Category" minWidth="min-w-[180px]" />
        {/* Status dropdown – fixed to show "In Progress" instead of "In_progress" */}
        <CustomSelect 
          options={statusOptions.map(s => {
            let label;
            if (s === 'all') label = 'All Statuses';
            else if (s === 'in_progress') label = 'In Progress';
            else label = s.charAt(0).toUpperCase() + s.slice(1);
            return { label, value: s };
          })} 
          value={filterStatus} 
          onChange={setFilterStatus} 
          placeholder="Status" 
          minWidth="min-w-[150px]" 
        />
        {/* Priority dropdown */}
        <CustomSelect options={priorityOptions.map(p => ({ label: p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1), value: p }))} value={filterPriority} onChange={setFilterPriority} placeholder="Priority" minWidth="min-w-[150px]" />
        {hasActiveFilter && <button onClick={() => { setFilterCategory('all'); setFilterStatus('all'); setFilterPriority('all'); }} className="text-xs text-blue-600 hover:underline">Clear filters</button>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/95">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned to</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedTickets.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-400 text-sm">No tickets found</td></tr>
              ) : (
                paginatedTickets.map((ticket) => {
                  const priorityDisplay = getPriorityDisplay(ticket);
                  return (
                    <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{ticket.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ticket.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ticket.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[90px] ${getStatusBadge(ticket.status)}`}>
                          {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[90px] ${priorityDisplay.color}`}>
                          {priorityDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {ticket.assignedTo || <span className="text-red-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openDetailsModal(ticket)} className="text-gray-500 hover:text-blue-600 transition-colors" title="View details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                          <button onClick={() => openUpdateModal(ticket)} className="text-gray-500 hover:text-blue-600 transition-colors" title="Edit ticket">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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

      {showUpdateModal && selectedTicket && (
        <UpdateTicketModal ticket={selectedTicket} staffList={staffList} onUpdate={handleUpdateTicket} onClose={() => { setShowUpdateModal(false); setSelectedTicket(null); }} />
      )}
      {showDetailsModal && selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={() => { setShowDetailsModal(false); setSelectedTicket(null); }} />
      )}
    </div>
  );
}