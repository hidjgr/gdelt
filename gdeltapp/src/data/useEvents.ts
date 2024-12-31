import { useState, useEffect } from 'react';
import { getSource } from "./sources";
import { Event } from "./GDELTTypes";

const source = getSource(import.meta.env.VITE_SOURCE);

const useEvents = (startDate: Date, endDate: Date, limits: object) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await source.fetchEvents(startDate, endDate, limits);
        setEvents(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    loadEvents(); 

  }, [startDate, endDate, limits]);

  return { events, loading, error};
};

export default useEvents;
