import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ticketService from '../../services/ticketService';
import { mapTicketFromApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StaffTicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const listRes = await ticketService.getAllTickets();
        if (!listRes.data.success) throw new Error(listRes.data.message || 'Failed');
        const list = (listRes.data.tickets || []).map(mapTicketFromApi);
        const found = list.find((t) => String(t.id) === String(id));
        if (!found) {
          if (!cancelled) setTicket(null);
          return;
        }
        if (!cancelled) setTicket(found);
        const logRes = await ticketService.getTicketLogs(id);
        if (logRes.data?.success && Array.isArray(logRes.data.logs) && !cancelled) {
          setLogs(logRes.data.logs);
        }
      } catch (e) {
        if (!cancelled) toast.error(e.response?.data?.message || e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="px-6 py-10 max-w-3xl mx-auto">
        <LoadingSpinner />
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="px-6 py-14 max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Ticket not found</h1>
        <Link to="/staff" className="text-blue-600 hover:underline text-sm">
          ← Back to staff desk
        </Link>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto space-y-6">
      <div>
        <Link to="/staff" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Staff desk
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{ticket.code}</h1>
        <p className="text-gray-600 mt-1">{ticket.subject}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-400">Status</div>
            <div className="font-medium">{ticket.status}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Priority</div>
            <div className="font-medium">{ticket.priority}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Category</div>
            <div>{ticket.category}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Assigned to</div>
            <div>{ticket.assignedTo || '—'}</div>
          </div>
        </div>
        {ticket.description && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Description</div>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        )}
      </div>
      {logs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Activity log</h2>
          <ul className="space-y-3 text-sm">
            {logs.map((log) => (
              <li key={log.id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                <div className="font-medium text-gray-800">{log.action}</div>
                {log.remarks && <div className="text-gray-600 text-xs mt-0.5">{log.remarks}</div>}
                <div className="text-xs text-gray-400 mt-1">
                  {log.created_at ? new Date(log.created_at).toLocaleString() : ''}
                  {log.performed_by ? ` · ${log.performed_by}` : ''}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
