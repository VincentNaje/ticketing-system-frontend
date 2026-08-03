import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ticketService from '../../services/ticketService';
import toast from 'react-hot-toast';
import bucengLogo from '../../assets/bucenglogo.png';

const GuestSubmission = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: 'Academic Concerns',
        email: '',
        subject: '',
        description: ''
    });

    const categories = [
        'Academic Concerns',
        'Faculty / Instructor',
        'Enrollment / Scheduling',
        'Facilities & Cleanliness',
        'Administrative Process',
        'Financial / Scholarship',
        'Others / General'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClear = () => {
        setFormData({
            category: 'Facilities and Cleanliness',
            email: '',
            subject: '',
            description: ''
        });
    };

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [ticketCode, setTicketCode] = useState('');


    const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);

    // ─── Map category name to category_id ───
    const categoryMap = {
        'Academic Concerns': 1,
        'Faculty / Instructor': 2,
        'Enrollment / Scheduling': 3,
        'Facilities & Cleanliness': 4,
        'Administrative Process': 5,
        'Financial / Scholarship': 6,
        'Others / General': 7,
    };

    try {
        const response = await ticketService.submitTicket({
        category_id: categoryMap[formData.category] || 7,
        subject: formData.subject,
        description: formData.description,
        submitter_email: formData.email || ''
        });

        // ─── Use real ticket code from backend ───
        const code = response.data.ticket_code;
        setTicketCode(code);
        setShowSuccessDialog(true);

    } catch (error) {
        toast.error('Failed to submit ticket. Please try again.');
        console.error('Submit error:', error);
    }
    };

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);
        navigate('/');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const handleClose = () => {
        navigate(-1); // Go back to previous page
    };

    const handleStaffLogin = () => {
        navigate('/staff-home');
    };
    const handleLogoClick = () => {
        navigate('/');
    };
    return (
        <div className="min-h-screen bg-gray-200">
            {/* Header */}
            <div className="bg-orange-500 px-6 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img
                            src={bucengLogo}
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

                <button
                    onClick={handleStaffLogin}
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="font-medium">Staff login</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-b from-blue-800 to-blue-600 min-h-[calc(100vh-82px)] flex items-start justify-center pt-12 px-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                        Submit a concern
                    </h2>

                    {/* Guest Mode Badge */}
                    <div className="flex justify-center mb-4">
                        <span className="bg-green-300 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                            Guest Mode
                        </span>
                    </div>

                    {/* Instructions */}
                    <p className="text-center text-gray-700 text-sm mb-6">
                        Please fill out the form below. All fields marked* are required.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Category Dropdown */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                                    Category<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email <span className="text-gray-500">(optional)</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="for notifications only"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-400 placeholder:text-sm"
                                />
                            </div>
                        </div>

                        {/* Subject Field */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                                Subject<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                                Description<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="sample..."
                                rows="5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none placeholder:text-gray-400"
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors font-medium"
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
                            >
                                Submit concern
                            </button>
                        </div>
                    </form>
                </div>
                {/* Confirmation Dialog */}
                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                            <p className="text-center text-gray-800 font-medium mb-6">
                                Are you sure you want to submit this concern?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowConfirmDialog(false)}
                                    className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmSubmit}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Dialog */}
                {showSuccessDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ticket submitted!</h3>
                                <p className="text-sm text-gray-600 mb-4">Save your ticket reference code below</p>

                                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-gray-700 mb-1">Your ticket code:</p>
                                    <p className="text-2xl font-bold text-blue-700">{ticketCode}</p>
                                </div>

                                <p className="text-xs text-gray-600 mb-4">Use this code to track your concern anytime</p>

                                <div className="border-t border-gray-200 pt-4 text-left space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-medium text-gray-900">{formData.category}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subject</span>
                                        <span className="font-medium text-gray-900">{formData.subject}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Status</span>
                                        <span className="font-medium text-green-600">Open</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Submitted</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCloseSuccess}
                                className="w-full px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default GuestSubmission;