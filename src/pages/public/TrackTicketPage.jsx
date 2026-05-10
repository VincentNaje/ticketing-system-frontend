import { useState } from 'react';
import toast from 'react-hot-toast';
import ticketService from '../../services/ticketService';

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function TrackTicketPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await ticketService.trackTicket(encodeURIComponent(trimmed));
      if (!data.success) {
        throw new Error(data.message || 'Not found');
      }
      setResult(data.ticket);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Ticket not found');
    } finally {
      setLoading(false);
    }
  };

  const catName = result?.categories?.name || '—';

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track a ticket</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter the ticket code you received after submission (for example TKT-2026-XXXXXX).
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono uppercase"
          placeholder="TKT-2026-…"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
          style={{ backgroundColor: '#095BBC' }}
        >
          {loading ? 'Searching…' : 'Look up'}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Ticket details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Ticket code">{result.ticket_code}</Field>
            <Field label="Status">{result.status}</Field>
            <Field label="Category">{catName}</Field>
            <Field label="Priority">{result.priority || '—'}</Field>
            <div className="sm:col-span-2">
              <Field label="Subject">{result.subject}</Field>
            </div>
          </div>
          {result.description && (
            <div>
              <div className="text-xs font-medium text-gray-400 mb-1">Description</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.description}</p>
            </div>
          )}
          {result.resolution_notes && (
            <div>
              <div className="text-xs font-medium text-gray-400 mb-1">Resolution notes</div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.resolution_notes}</p>
            </div>
          )}
          <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Submitted {result.created_at ? new Date(result.created_at).toLocaleString() : '—'}
            {result.updated_at && (
              <> · Updated {new Date(result.updated_at).toLocaleString()}</>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
