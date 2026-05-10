import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setReady(true);
      return;
    }
    authService
      .getMe()
      .then((res) => {
        if (res.data?.success && res.data.staff) {
          setUser(res.data.staff);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (!res.data?.success || !res.data.token) {
      throw new Error(res.data?.message || 'Login failed');
    }
    localStorage.setItem('token', res.data.token);
    setUser(res.data.staff);
    return res.data.staff;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
