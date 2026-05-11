import api from './api';

const ticketService = {
  // ─── Public ───
  submitTicket: (data) =>
    api.post('/api/tickets/submit', data),

  trackTicket: (ticket_code) =>
    api.get(`/api/tickets/track/${ticket_code}`),

  // ─── Staff / Admin ───
  getAllTickets: () =>
    api.get('/api/tickets/all'),

  getTicketLogs: (ticket_id) =>
    api.get(`/api/tickets/${ticket_id}/logs`),

  updateStatus: (ticket_id, data) =>
    api.patch(`/api/tickets/${ticket_id}/status`, data),

  assignTicket: (ticket_id, data) =>
    api.patch(`/api/tickets/${ticket_id}/assign`, data),

  resolveTicket: (ticket_id, data) =>
    api.patch(`/api/tickets/${ticket_id}/resolve`, data),
};

export default ticketService;