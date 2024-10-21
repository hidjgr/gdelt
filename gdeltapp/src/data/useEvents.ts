import { useState, useEffect } from 'react';
import { getSource } from "./sources";
import { Event } from "./GDELTTypes";

const source = getSource("sample");

const useEvents = (startDate: Date, endDate: Date) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await source.fetchEvents(startDate, endDate);
        setEvents(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    loadEvents(); 

  }, [startDate, endDate]);

  return { events, loading, error};
};

export default useEvents;
