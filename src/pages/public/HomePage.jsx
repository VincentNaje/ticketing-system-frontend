import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Complaint &amp; Ticketing System
      </h1>
      <p className="text-gray-600 mb-10 leading-relaxed">
        Submit a concern about facilities, academics, enrollment, and more. Guests may
        submit anonymously. Use your ticket code to track progress anytime.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/submit"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow transition"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Submit a concern</h2>
          <p className="text-sm text-gray-500">Fill out the form and receive a ticket code.</p>
        </Link>
        <Link
          to="/track"
          className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow transition"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Track a ticket</h2>
          <p className="text-sm text-gray-500">Enter your ticket code to see status updates.</p>
        </Link>
      </div>
    </main>
  );
}
