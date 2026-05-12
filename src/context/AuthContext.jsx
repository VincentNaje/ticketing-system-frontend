import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Check if user is already logged in on page load ───
  useEffect(() => {
    const savedStaff = localStorage.getItem('staff');
    const token = localStorage.getItem('token');
    if (savedStaff && token) {
      setUser(JSON.parse(savedStaff));
    }
    setLoading(false);
  }, []);

  // ─── Login ───
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token, staff } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('staff', JSON.stringify(staff));

      setUser(staff);
      return { success: true, role: staff.role };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed.'
      };
    }
  };

  // ─── Logout ───
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('staff');
    setUser(null);
    window.location.href = '/staff-home';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);