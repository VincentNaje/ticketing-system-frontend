import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const STATUS_MAP = {
  Open: 'open',
  'In Progress': 'in_progress',
  Resolved: 'resolved',
  Closed: 'closed',
};

const PRIORITY_MAP = {
  Urgent: 'urgent',
  High: 'high',
  Normal: 'normal',
  Low: 'low',
};

export function mapTicketFromApi(t) {
  const statusRaw = t.status || '';
  const statusKey = STATUS_MAP[statusRaw] || String(statusRaw).toLowerCase().replace(/\s+/g, '_');
  const pri = t.priority || 'Normal';
  const priorityKey = PRIORITY_MAP[pri] || String(pri).toLowerCase();

  return {
    id: t.id,
    code: t.ticket_code,
    subject: t.subject,
    category: t.categories?.name ?? '—',
    status: statusKey,
    priority: priorityKey,
    assignedTo: t.assigned_to || '',
    submittedBy: t.is_anonymous
      ? 'Anonymous (guest)'
      : (t.submitter_email || '—'),
    created_at: t.created_at,
    updated_at: t.updated_at,
    description: t.description || '',
    resolutionNotes: t.resolution_notes || '',
    resolutionDate: null,
    resolvedBy: null,
    history: [],
  };
}

function statsFromTickets(mapped) {
  return {
    total: mapped.length,
    needAction: mapped.filter((x) => x.status === 'open').length,
    inProgress: mapped.filter((x) => x.status === 'in_progress').length,
    resolved: mapped.filter((x) => x.status === 'resolved').length,
  };
}

export const adminAPI = {
  async getDashboard() {
    const { data } = await api.get('/api/tickets/all');
    if (!data.success) {
      throw new Error(data.message || 'Failed to load tickets');
    }
    const list = (data.tickets || []).map(mapTicketFromApi);
    return { data: { stats: statsFromTickets(list), tickets: list } };
  },

  /** @deprecated Prefer getDashboard to avoid duplicate requests */
  getStats: async () => {
    const { data } = await adminAPI.getDashboard();
    return { data: data.stats };
  },

  /** @deprecated Prefer getDashboard to avoid duplicate requests */
  getAllTickets: async () => {
    const { data } = await adminAPI.getDashboard();
    return { data: data.tickets };
  },
};

export default api;
