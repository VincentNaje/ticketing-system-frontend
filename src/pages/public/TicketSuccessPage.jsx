import { useNavigate, useSearchParams } from 'react-router-dom';
import { User } from 'lucide-react';

// Mock data — replace with real API call
const mockTicketData = {
  'TKT-2026-ZBYP1G': {
    code: 'TKT-2026-ZBYP1G',
    description: 'Unclean restroom 1st floor',
    status: 'In Progress',
    assignedTo: 'Mr. Santos',
    priority: 'High',
    timeline: [
      {
        color: 'bg-purple-500',
        label: 'Ticket Submitted',
        detail: 'April 30, 2026  9:00 AM  system',
      },
      {
        color: 'bg-blue-500',
        label: 'Assigned to Ms. Sarah Santos',
        detail: 'April 30, 2026  10:15 AM',
      },
      {
        color: 'bg-green-500',
        label: 'Status → In progress',
        detail: 'April 30, 2026  10:20 AM  Ms. Santos',
      },
    ],
  },
};

const TicketSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  const ticket = mockTicketData[code];

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
        <div className="bg-white rounded-xl border-2 border-orange-400 shadow-2xl p-10 w-full max-w-lg relative">

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
          <p className="text-center text-sm text-gray-500 mb-8">
            Enter your reference code to check status
          </p>

          {!ticket ? (
            <p className="text-center text-red-500 text-sm">
              No ticket found for code: <strong>{code}</strong>
            </p>
          ) : (
            <>
              {/* Reference code */}
              <p className="text-sm text-gray-800 mb-5">
                Ticket reference code:{' '}
                <span className="text-orange-500 font-bold text-base">{ticket.code}</span>
              </p>

              {/* Description + Status badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900 text-sm">{ticket.description}</span>
                <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {ticket.status}
                </span>
              </div>

              {/* Info table */}
              <div className="mb-5">
                <div className="flex justify-between py-2 text-sm text-gray-800">
                  <span className="font-medium">Assigned to</span>
                  <span>{ticket.assignedTo}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between py-2 text-sm text-gray-800">
                  <span className="font-medium">Priority</span>
                  <span>{ticket.priority}</span>
                </div>
                <hr className="border-gray-300" />
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-4">
                {ticket.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${item.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSuccessPage;