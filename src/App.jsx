import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import StaffLayout from './components/layout/StaffLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import SubmitTicketPage from './pages/public/SubmitTicketPage';
import TrackTicketPage from './pages/public/TrackTicketPage';
import TicketSuccessPage from './pages/public/TicketSuccessPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffTicketDetail from './pages/staff/StaffTicketDetail';

function BootGate({ children }) {
  const { ready } = useAuth();
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 text-sm">
        Loading…
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BootGate>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitTicketPage />} />
            <Route path="/track" element={<TrackTicketPage />} />
            <Route path="/ticket-success" element={<TicketSuccessPage />} />
            <Route path="/404" element={<NotFoundPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StaffDashboard />} />
            <Route path="tickets/:id" element={<StaffTicketDetail />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BootGate>
    </AuthProvider>
  );
}
