// src/pages/staff/HistoryLogView.jsx
import React, { useState, useEffect } from 'react';

// ── Custom Select ──────────────────────────────────────────────────────
function CustomSelect({ options, value, onChange, placeholder, minWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
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

// ── Mock history log ────────────────────────────────────────────────────
const MOCK_HISTORY = [
  { id: 1, action: 'Ticket assigned to you', details: 'TKT-2026-001 – Unclean restroom', date: '2026-05-01T10:00:00Z', performedBy: 'Admin' },
  { id: 2, action: 'Status updated', details: 'TKT-2026-001 changed from Open to In Progress', date: '2026-05-02T14:30:00Z', performedBy: 'Admin' },
  { id: 3, action: 'Resolution added', details: 'TKT-2026-004 – Scholarship delay resolved', date: '2026-05-08T09:15:00Z', performedBy: 'Admin' },
  { id: 4, action: 'New ticket assigned', details: 'TKT-2026-005 – Class scheduling conflict', date: '2026-05-09T08:00:00Z', performedBy: 'Admin' },
  { id: 5, action: 'Ticket resolved', details: 'TKT-2026-004 marked as resolved', date: '2026-05-08T10:00:00Z', performedBy: 'System' },
  { id: 6, action: 'Priority changed', details: 'TKT-2026-006 set to High', date: '2026-05-02T09:00:00Z', performedBy: 'Admin' },
];

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

export default function HistoryLogView() {
  const [history, setHistory] = useState(MOCK_HISTORY);
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

  const actionTypes = ['all', ...new Set(history.map(h => h.action))];
  const dateOptions = [
    { label: 'All Dates', value: 'all' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
  ];
  const actionOptions = actionTypes.map(act => ({ label: act === 'all' ? 'All Actions' : act, value: act }));

  const filteredHistory = history.filter(item => {
    if (filterAction !== 'all' && item.action !== filterAction) return false;
    if (filterDate !== 'all' && !isWithinDateRange(item.date, filterDate)) return false;
    return true;
  });

  const hasActiveFilter = filterAction !== 'all' || filterDate !== 'all';
  const clearFilters = () => {
    setFilterAction('all');
    setFilterDate('all');
  };

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setCurrentPage(1), [filterAction, filterDate]);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">History Log</h1>
        <p className="text-sm text-gray-500 mt-1">Track all your activities and ticket updates</p>
      </div>

      {/* Filter bar – Action & Date (with separate label) */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <CustomSelect options={actionOptions} value={filterAction} onChange={setFilterAction} placeholder="Action" minWidth="min-w-[160px]" />
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-600">Date:</span>
          <CustomSelect options={dateOptions} value={filterDate} onChange={setFilterDate} placeholder="Date" minWidth="min-w-[150px]" />
        </div>
        {hasActiveFilter && (
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear filters</button>
        )}
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