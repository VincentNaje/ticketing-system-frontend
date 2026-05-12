// src/pages/admin/UserManagementView.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// ── Custom Select Dropdown ────────────────────────────────────────────────
function CustomSelect({ options, value, onChange, placeholder, minWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';
  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-blue-50 cursor-pointer ${value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Confirmation Modal ────────────────────────────────────────────────────
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;
  const isDelete = confirmText === 'Deactivate';
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 whitespace-pre-line">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">{cancelText}</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${isDelete ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#095BBC] hover:bg-[#07459e] text-white'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Success Modal ─────────────────────────────────────────────────────────
function SuccessModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-green-100 bg-green-50">
          <h3 className="text-lg font-semibold text-green-700">✓ Success</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm">OK</button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit User Modal ─────────────────────────────────────────────────
function UserModal({ isOpen, onClose, onSave, user, title }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    if (user) {
      const fullName = user.full_name || '';
      const spaceIndex = fullName.indexOf(' ');
      if (spaceIndex > 0) {
        setFirstName(fullName.substring(0, spaceIndex));
        setLastName(fullName.substring(spaceIndex + 1));
      } else {
        setFirstName(fullName);
        setLastName('');
      }
      setEmail(user.email || '');
      setRole(user.role || 'staff');
      setPassword('');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('staff');
      setPassword('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);
    const fullName = `${firstName} ${lastName}`.trim();
    try {
      await onSave({ full_name: fullName, email, role, password });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const roleOptions = [
    { label: 'Staff', value: 'staff' },
    { label: 'Admin', value: 'admin' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">{errorMsg}</div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              First Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Last Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Email Address <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400" required />
          </div>
          {/* Password only shown when adding a new user */}
          {!user && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Password <span className="text-red-500 ml-1">*</span>
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                required={!user} placeholder="Minimum 6 characters" minLength={6} />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Role</label>
            <CustomSelect options={roleOptions} value={role} onChange={setRole} placeholder="Select role" minWidth="w-full" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('fetchUsers error:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [users.length]);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  // ── Add User ─────────────────────────────────────────────────────────────
  const handleAddUser = async ({ full_name, email, role, password }) => {
    const res = await api.post('/api/admin/users', { full_name, email, role, password })
      .catch(err => { throw new Error(err.response?.data?.message || 'Failed to add user.'); });
    setUsers(prev => [...prev, res.data.user]);
    setShowAddModal(false);
    setSuccessMessage('User added successfully!');
    setShowSuccess(true);
  };

  // ── Edit User ─────────────────────────────────────────────────────────────
  const handleEditUser = async ({ full_name, email, role }) => {
    const res = await api.put(`/api/admin/users/${selectedUser.id}`, { full_name, email, role })
      .catch(err => { throw new Error(err.response?.data?.message || 'Failed to update user.'); });
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? res.data.user : u));
    setShowEditModal(false);
    setSelectedUser(null);
    setSuccessMessage('User updated successfully!');
    setShowSuccess(true);
  };

  // ── Deactivate User ───────────────────────────────────────────────────────
  const handleDeactivateUser = async () => {
    try {
      const res = await api.delete(`/api/admin/users/${userToDeactivate.id}`);
      setUsers(prev => prev.filter(u => u.id !== userToDeactivate.id));
      setShowConfirmDeactivate(false);
      setUserToDeactivate(null);
      setSuccessMessage(res.data.message || 'User deactivated successfully!');
      setShowSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate user.');
    }
  };

  const openEditModal = (user) => { setSelectedUser(user); setShowEditModal(true); };
  const openDeactivateConfirm = (user) => { setUserToDeactivate(user); setShowConfirmDeactivate(true); };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Users Total: {users.length}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#095BBC] hover:bg-[#07459e] text-white text-sm font-medium rounded-lg transition shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/95">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-gray-400 text-sm">No users found</td></tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{user.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium min-w-[70px] ${
                        user.role === 'admin' || user.role === 'superadmin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEditModal(user)} className="text-gray-500 hover:text-blue-600 transition-colors" title="Edit user">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        </button>
                        {user.is_active && (
                          <button onClick={() => openDeactivateConfirm(user)} className="text-red-400 hover:text-red-600 transition-colors" title="Deactivate user">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50/30 px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Showing {users.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, users.length)} of {users.length} users
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50">‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5 && currentPage > 3) page = currentPage - 3 + i;
              if (page > totalPages) return null;
              return <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{page}</button>;
            }).filter(Boolean)}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50">›</button>
          </div>
        </div>
      </div>

      <UserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddUser} title="Add New User" />

      <UserModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedUser(null); }}
        onSave={handleEditUser}
        user={selectedUser}
        title="Edit User"
      />

      <ConfirmationModal
        isOpen={showConfirmDeactivate}
        onClose={() => { setShowConfirmDeactivate(false); setUserToDeactivate(null); }}
        onConfirm={handleDeactivateUser}
        title="Deactivate User"
        message={`Are you sure you want to deactivate "${userToDeactivate?.full_name}"?\n\nThey will no longer be able to log in.`}
        confirmText="Deactivate"
        cancelText="Cancel"
      />

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMessage} />
    </div>
  );
}