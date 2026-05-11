import api from './api';

const authService = {
  login: (data) =>
    api.post('/api/auth/login', data),

  register: (data) =>
    api.post('/api/auth/register', data),

  getMe: () =>
    api.get('/api/auth/me'),
};

export default authService;