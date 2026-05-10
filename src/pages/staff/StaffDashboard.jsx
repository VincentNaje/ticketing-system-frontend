import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useTickets } from '../../hooks/useTickets';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StaffDashboard() {
  const { tickets, loading, error, reload } = useTickets();

  useEffect(() => {
    if (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load');
    }
  }, [error]);

  if (loading) {
    return (
      <main className="px-6 py-10">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff desk</h1>
          <p className="text-sm text-gray-500 mt-1">
            All tickets (overview). Use Admin → Assign Tickets to update assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reload()}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No tickets yet.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-mono text-gray-700">{t.code}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{t.subject}</td>
                  <td className="px-4 py-3 text-gray-500">{t.category}</td>
                  <td className="px-4 py-3">{t.status}</td>
                  <td className="px-4 py-3">{t.priority}</td>
                  <td className="px-4 py-3 text-gray-500">{t.assignedTo || '—'}</td>
                  <td className="px-4 py-3">
                    <Link to={`/staff/tickets/${t.id}`} className="text-blue-600 hover:underline text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
