import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;