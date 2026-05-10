import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-gray-200 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you requested does not exist or was moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-lg text-white text-sm font-medium"
        style={{ backgroundColor: '#095BBC' }}
      >
        Back to home
      </Link>
    </main>
  );
}
