import { useState, useEffect } from 'react';
import { getSource } from "./sources";
import { Event } from "./GDELTTypes";

const source = getSource(import.meta.env.VITE_SOURCE);

const useEvents = (params: object) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await source.fetchEvents(params.startHour, params.endHour, params.limits);
        setEvents(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

  }, [params]);

  return { events, loading, error};
};

export default useEvents;
