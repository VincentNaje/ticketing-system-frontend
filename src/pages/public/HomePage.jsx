import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStaffLogin = () => {
    navigate('/staff-home');
  };

  const handleTrackTicket = () => {
    navigate('/track-ticket');
  };
  const handleSubmitTicket = () => {
        navigate('/submit-ticket');
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-blue-200 to-blue-300">
      

      {/* Top Navigation Bar */}
      <div className="bg-orange-600 px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            
            <img 
              src="/src/assets/bucenglogo.png" 
              alt="Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <h6 className="px-6 text-2xl font-medium text-white mb-1">
              BUCENG Complaint and Ticketing System
          </h6>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleTrackTicket}
            className="px-4 py-2 border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium"
          >
            Track ticket
          </button>
          <button 
            onClick={handleStaffLogin}
            className="px-6 py-2 bg-white text-orange-600 rounded-md hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 shadow-md"
          >
            <User size={20} />
            Staff login
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 px-8 py-16 text-center shadow-xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          Have a concern? We're here to help.
        </h1>
        <p className="text-white text-lg mb-2">
          Submit your complaints, suggestions, or concerns confidentially.
        </p>
        <p className="text-white text-lg">
          Track progress in real-time.
        </p>
      </div>

      {/* Card Section */}
      <div className="flex justify-center items-start py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-orange-400">
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <h2 className="px-8 text-2xl font-bold justify-center text-gray-900">
              Submit as Guest
            </h2>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-1 text-base">
            Submit your concerns <span className="font-bold">anonymously</span>
          </p>
          <p className="text-gray-700 mb-1 text-base">
            without creating an account.
          </p>
          <p className="text-gray-700 mb-6 text-base">
            Perfect for sensitive issues.
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <svg 
                className="w-5 h-5 text-green-500 flex-shrink-0" 
                fill="none" 
                strokeWidth="3" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-base">No account or login required</span>
            </div>
            <div className="flex items-center gap-3">
              <svg 
                className="w-5 h-5 text-green-500 flex-shrink-0" 
                fill="none" 
                strokeWidth="3" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-base">Your identity stayss completely private</span>
            </div>
          </div>

          {/* Submit Button */}
          <button 
          onClick={handleSubmitTicket}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 text-lg">
            Submit Anonymously
            
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <ArrowRight size={20} className="text-orange-500" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;