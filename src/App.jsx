import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/LoginPage';
import Homepage_staff from './pages/public/Homepage_staff';
import GuestSubmission from './pages/public/guest_submission';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff-home" element={<Homepage_staff />} />
        <Route path="/submit-ticket" element={<GuestSubmission />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;