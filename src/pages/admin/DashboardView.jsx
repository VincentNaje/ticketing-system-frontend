// src/pages/admin/DashboardView.jsx
// Fixed: modal header no longer transparent
import { useState, useEffect } from 'react';

// ── Ticket Details Modal (solid white header) ────────────────────────────
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  const getStatusBadgeModal = (status) => {
    const colors = {
      open: 'bg-[#E6F1FB] text-[#0D457D]',
      in_progress: 'bg-[#FAEEDA] text-[#653A08]',
      resolved: 'bg-[#EAF3DE] text-[#2A530D]',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.open;
  };

  const getPriorityDisplay = () => {
    if (ticket.status === 'open') return { text: 'normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (ticket.status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-[#EAF3DE] text-[#2A530D]',
      low: 'bg-gray-100 text-gray-800',
    };
    return { text: ticket.priority, color: colors[ticket.priority] || colors.normal };
  };

  const priorityDisplay = getPriorityDisplay();

  return (
    <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Solid white header (no transparency, no close button) */}
        <div className="sticky top-0 z-10 bg-white px-6 py-5 border-b border-slate-100 rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800">Ticket Details</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* ... (rest of the modal content unchanged) ... */}
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
          <button onClick={onClose} className="px-5 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardView({
  stats,
  tickets,
  loading,
  searchQuery = '',
}) {
  const displayTickets = Array.isArray(tickets) ? tickets : [];
  const displayStats = stats && typeof stats === 'object'
    ? stats
    : { total: 0, needAction: 0, inProgress: 0, resolved: 0 };
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusBadge = (status) => {
    const colors = {
      open: 'bg-[#E6F1FB] text-[#0D457D]',
      in_progress: 'bg-[#FAEEDA] text-[#653A08]',
      resolved: 'bg-[#EAF3DE] text-[#2A530D]',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.open;
  };

  const getPriorityBadge = (ticket) => {
    if (ticket.status === 'open') return { text: 'normal', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    if (ticket.status === 'resolved') return { text: 'Done', color: 'bg-[#EAF3DE] text-[#2A530D]' };
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-[#EAF3DE] text-[#2A530D]',
      low: 'bg-gray-100 text-gray-800',
    };
    return { text: ticket.priority, color: colors[ticket.priority] || colors.normal };
  };

  const q = (searchQuery || '').trim().toLowerCase();
  const searchedTickets = q
    ? displayTickets.filter(
        (t) =>
          (t.code && String(t.code).toLowerCase().includes(q)) ||
          (t.subject && String(t.subject).toLowerCase().includes(q)) ||
          (t.category && String(t.category).toLowerCase().includes(q))
      )
    : displayTickets;

  const counts = {
    all: searchedTickets.length,
    open: searchedTickets.filter((t) => t.status === 'open').length,
    in_progress: searchedTickets.filter((t) => t.status === 'in_progress').length,
    resolved: searchedTickets.filter((t) => t.status === 'resolved').length,
  };

  const filteredTickets = searchedTickets.filter(
    (t) => statusFilter === 'all' || t.status === statusFilter
  );
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setCurrentPage(1), [statusFilter, searchQuery]);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  const statCards = [
    { title: 'Total Tickets', value: displayStats.total, subtitle: 'All time', circleColor: '#71437D', numberColor: '#71437D', bgColor: '#F4E4F8' },
    { title: 'Open', value: displayStats.needAction, subtitle: 'Need Action', circleColor: '#0D457D', numberColor: '#0D457D', bgColor: '#E6F1FB' },
    { title: 'In progress', value: displayStats.inProgress, subtitle: 'Being handled', circleColor: '#FA9E01', numberColor: '#653A08', bgColor: '#FAEEDA' },
    { title: 'Resolved', value: displayStats.resolved, subtitle: 'Completed', circleColor: '#49A821', numberColor: '#2A530D', bgColor: '#EAF3DE' },
  ];

  const formatStatusLabel = (status) => {
    if (!status) return '—';
    if (status === 'in_progress') return 'In Progress';
    return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500 text-sm">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {statCards.map((card) => (
          <div key={card.title} className="rounded-xl p-7 relative shadow-md" style={{ backgroundColor: card.bgColor }}>
            <div className="absolute top-4 right-4 w-5 h-5 rounded-full" style={{ backgroundColor: card.circleColor }}></div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">{card.title}</h3>
              <p className="text-4xl font-bold mt-1" style={{ color: card.numberColor }}>{card.value}</p>
            </div>
            <div className="absolute bottom-4 right-4"><p className="text-xs text-gray-600">{card.subtitle}</p></div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">All Tickets</h2>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-1">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'open', label: 'Open', count: counts.open },
          { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
          { key: 'resolved', label: 'Resolved', count: counts.resolved },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${statusFilter === tab.key ? 'bg-gray-100 text-gray-800 border border-gray-300' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}
          >
            <span className={`flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${statusFilter === tab.key ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>
            {tab.label}
          </button>
        ))}
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
                <th className="px-2 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedTickets.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-400 text-sm">No tickets found</td></tr>
              ) : (
                paginatedTickets.map((ticket) => {
                  const priority = getPriorityBadge(ticket);
                  return (
                    <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{ticket.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ticket.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ticket.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[90px] ${getStatusBadge(ticket.status)}`}>
                          {formatStatusLabel(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[90px] ${priority.color}`}>
                          {priority.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ticket.assignedTo || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-gray-500 hover:text-blue-600 transition-colors" title="View ticket details" onClick={() => setSelectedTicket(ticket)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
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

      {selectedTicket && <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
}