import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function postLoginPath(staff) {
  if (!staff) return '/staff';
  if (staff.role === 'admin' || staff.role === 'superadmin') return '/admin';
  return '/staff';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && user) {
      navigate(postLoginPath(user), { replace: true });
    }
  }, [ready, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staff = await login(email, password);
      navigate(postLoginPath(staff));
    } catch (err) {
      alert(err?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-1 text-gray-900">Staff login</h2>
        <p className="text-xs text-gray-500 mb-5">BUCENG staff and administrators</p>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full text-white py-2.5 rounded text-sm font-medium"
          style={{ backgroundColor: '#095BBC' }}
        >
          Sign in
        </button>
      </form>
      <Link to="/" className="mt-6 text-sm text-blue-700 hover:underline">
        ← Back to public site
      </Link>
    </div>
  );
}
