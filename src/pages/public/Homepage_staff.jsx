import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Homepage_staff = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            toast.success('Welcome back!');
            // ─── Redirect based on role ───
            if (result.role === 'admin' || result.role === 'superadmin') {
            navigate('/admin');
            } else {
            navigate('/staff');
            }
        } else {
            setError(result.message || 'Invalid email or password.');
            toast.error(result.message || 'Invalid email or password.');
        }

        setLoading(false);
    };

    const handleTrackTicket = () => {
        navigate('/track-ticket');
    };

    const handleSubmitTicket = () => {
        navigate('/submit-ticket');
    };

    const handleBackToHome = () => {
        navigate('/');
    };
    const handleLogoClick = () => {
        navigate('/');
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-200 via-blue-200 to-blue-400">
            {/* Top Navigation Bar */}
            <div className="bg-orange-600 px-6 py-4 flex items-center justify-between shadow-lg">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img
                            src="/src/assets/bucenglogo.png"
                            alt="Logo"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    </div>
                    <button
                        onClick={handleLogoClick}
                        className="px-3 text-2xl font-medium text-white mb-1">
                        BUCENG Complaint and Ticketing System
                    </button>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleTrackTicket}
                        className="px-5 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-orange-500 transition-colors font-medium"
                    >
                        Track Ticket
                    </button>
                    <button
                        onClick={handleSubmitTicket}
                        className="px-5 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-orange-500 transition-colors font-medium"
                    >
                        Submit Ticket
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex justify-center items-center py-20 px-4">
                <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full border-4 border-orange-400">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="flex items-end justify-center gap-1">
                                <img
                                    src="/src/assets/Staff.png"
                                    alt="Logo"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Staff Login
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-500 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                    {/* Login Button */}
                    {/* Error Message */}
                    {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded border border-red-200">
                        {error}
                    </div>
                    )}

                    {/* Login Button */}
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors font-semibold text-base disabled:opacity-50"
                    >
                    {loading ? 'Logging in...' : 'Login'}
                    </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleBackToHome}
                            className="text-gray-800 text-sm hover:text-orange-500 hover:underline transition-colors"
                        >
                            Have a concern in mind? Reach out to us anytime
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage_staff;