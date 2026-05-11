export const adminAPI = {
  getStats: () => Promise.resolve({ data: { total: 20, needAction: 20, inProgress: 20, resolved: 20 } }),
  getAllTickets: () => Promise.resolve({ data: [
    { id: 1, code: 'TKT-2026-ZBYPIG', subject: 'Unclean restroom', category: 'Facilities', status: 'in_progress', priority: 'high', assignedTo: 'Ms. Santos' }
  ] }),
};