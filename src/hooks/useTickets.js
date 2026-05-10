import { useState, useEffect, useCallback } from 'react';
import ticketService from '../services/ticketService';
import { mapTicketFromApi } from '../services/api';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await ticketService.getAllTickets();
      if (!data.success) throw new Error(data.message || 'Failed to load tickets');
      setTickets((data.tickets || []).map(mapTicketFromApi));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { tickets, loading, error, reload: load };
}
