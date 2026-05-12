import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const TrackTicketPage = () => {
  const [ticketCode, setTicketCode] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (ticketCode.trim()) {
      navigate(`/ticket-status?code=${ticketCode.trim()}`);
    }
  };

  const handleClose = () => navigate('/');
  const handleStaffLogin = () => navigate('/staff-home');

  return (
    <div className="min-h-screen flex flex-col bg-gray-300">

      {/* Navbar */}
      <div className="bg-orange-500 px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/src/assets/bucenglogo.png"
            alt="BUCENG Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-white font-bold text-lg">
            BUCENG Complaint and Ticketing System
          </span>
        </div>
        <button
          onClick={handleStaffLogin}
          className="flex items-center gap-2 text-white font-semibold text-sm hover:opacity-80 transition-opacity"
        >
          <User size={20} />
          Staff login
        </button>
      </div>

      {/* Blue background area */}
      <div className="flex-1 bg-blue-900 flex items-center justify-center px-4 py-16">

        {/* Card */}
        <div className="bg-white rounded-xl border-2 border-orange-400 shadow-2xl p-10 w-full max-w-md relative">

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>

          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">
            Track a Ticket
          </h2>
          <p className="text-center text-sm text-gray-500 mb-10">
            Enter your reference code to check status
          </p>

          <form onSubmit={handleTrack} className="flex flex-col items-center gap-4">
            <label className="text-sm text-gray-700 font-medium">
              Ticket reference code
            </label>
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="e.g  TKT-2026-ZBYP1G"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-400 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-3 rounded-md transition-colors text-sm mt-1"
            >
              Track Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackTicketPage;