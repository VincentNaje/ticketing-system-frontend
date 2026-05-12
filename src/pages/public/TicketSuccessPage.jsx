import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User } from 'lucide-react';
import ticketService from '../../services/ticketService';

const TicketSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) fetchTicket();
  }, [code]);

  const fetchTicket = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ticketService.trackTicket(code);
      setTicket(response.data.ticket);
    } catch (err) {
      setError(`No ticket found for code: ${code}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => navigate('/');
  const handleStaffLogin = () => navigate('/staff-home');

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const dotColors = [
    'bg-green-500',
    'bg-blue-600',
    'bg-orange-400',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-gray-400',
  ];

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved' || s === 'closed') return 'bg-green-500';
    if (s === 'in progress') return 'bg-orange-500';
    return 'bg-orange-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-300">

      {/* Navbar */}
      <div className="bg-orange-500 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/src/assets/bucenglogo.png" alt="BUCENG Logo" className="w-12 h-12 rounded-full object-cover" />
          <span className="text-white font-bold text-lg">BUCENG Complaint and Ticketing System</span>
        </div>
        <button onClick={handleStaffLogin} className="flex items-center gap-2 text-white font-semibold text-sm hover:opacity-80">
          <User size={20} /> Staff login
        </button>
      </div>

      {/* Blue background */}
      <div className="flex-1 bg-blue-900 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl border-2 border-orange-400 shadow-2xl p-8 w-full max-w-lg relative">
          <button onClick={handleClose} className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl font-bold">✕</button>

          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">Track a Ticket</h2>
          <p className="text-center text-sm text-gray-500 mb-6">Enter your reference code to check status</p>

          {loading && <p className="text-center text-gray-500 text-sm">Loading ticket...</p>}
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}

          {!loading && ticket && (
            <>
              {/* Reference code */}
              <p className="text-sm text-gray-800 mb-4">
                Ticket reference code:{' '}
                <span className="text-orange-500 font-bold text-base">{ticket.ticket_code}</span>
              </p>

              {/* Subject + Status badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-900 text-sm">{ticket.subject}</span>
                <span className={`${getStatusColor(ticket.status)} text-white text-xs font-semibold px-4 py-1 rounded-full`}>
                  {ticket.status}
                </span>
              </div>

              {/* Info table */}
              <div className="mb-5 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between px-4 py-2.5 text-sm text-gray-800 bg-gray-50">
                  <span className="font-medium text-gray-500">Category</span>
                  <span className="font-semibold">{ticket.categories?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm text-gray-800">
                  <span className="font-medium text-gray-500">Assigned to</span>
                  <span className="font-semibold">{ticket.assigned_to || 'Not yet assigned'}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm text-gray-800 bg-gray-50">
                  <span className="font-medium text-gray-500">Priority</span>
                  <span className="font-semibold capitalize">{ticket.priority || 'N/A'}</span>
                </div>
                {ticket.resolution_notes && (
                  <div className="flex justify-between px-4 py-2.5 text-sm text-gray-800">
                    <span className="font-medium text-gray-500">Resolution</span>
                    <span className="text-right max-w-[60%]">{ticket.resolution_notes}</span>
                  </div>
                )}
              </div>

              {/* ── Activity History Timeline ── */}
              {ticket.history && ticket.history.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                    </svg>
                    Activity History
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 space-y-4">
                    {ticket.history.map((entry, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        {/* Colored dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-3 h-3 rounded-full mt-0.5 ${dotColors[idx % dotColors.length]}`} />
                          {idx < ticket.history.length - 1 && (
                            <div className="w-px flex-1 bg-gray-300 mt-1 min-h-[20px]" />
                          )}
                        </div>
                        {/* Entry details */}
                        <div className="flex-1 pb-1">
                          <p className="text-sm font-semibold text-gray-800">{entry.action}</p>
                          {entry.details && (
                            <p className="text-xs text-gray-500 mt-0.5">{entry.details}</p>
                          )}
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
                </div>
              )}

              {/* Track another button */}
              <button
                onClick={() => navigate('/track-ticket')}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-colors text-sm"
              >
                Track another ticket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSuccessPage;