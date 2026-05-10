import { Link, useLocation } from 'react-router-dom';

export default function TicketSuccessPage() {
  const location = useLocation();
  const code = location.state?.ticketCode || '';

  return (
    <main className="max-w-xl mx-auto px-6 py-14 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 text-2xl mb-4">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket submitted</h1>
      <p className="text-gray-600 mb-6">
        Keep this code to track your concern. A copy is not emailed unless you provided an
        address.
      </p>
      {code ? (
        <p className="font-mono text-lg font-semibold text-[#011787] mb-8 break-all">{code}</p>
      ) : (
        <p className="text-sm text-amber-700 mb-8">
          No code in session. If you closed this page, check with the office or submit again.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/track"
          className="inline-flex justify-center px-5 py-2.5 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#095BBC' }}
        >
          Track this ticket
        </Link>
        <Link
          to="/submit"
          className="inline-flex justify-center px-5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
        >
          Submit another
        </Link>
        <Link to="/" className="inline-flex justify-center px-5 py-2.5 text-sm text-blue-700 hover:underline">
          Home
        </Link>
      </div>
    </main>
  );
}
