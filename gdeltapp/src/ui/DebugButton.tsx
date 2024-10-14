import useCodes from '../data/useCodes';
import useEvents from '../data/useEvents';
import { useState } from 'react';

const DebugPanel = () => {
  const { codes, loading: loadingCodes, error: errorCodes } = useCodes('country');

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { events, loading: loadingEvents, error: errorEvents } = useEvents(startDate, endDate);

  const handleGetCountries = () => {
    if (loadingCodes) {
      console.log('Loading CAMEO countries...');
    } else if (errorCodes) {
      console.log('Error:', errorCodes);
    } else {
      console.log('Fetched CAMEO countries:', codes);
    }
  };

  const handleGetEvents = () => {
    if (loadingEvents) {
      console.log('Loading events...');
    } else if (errorEvents) {
      console.log('Error:', errorEvents);
    } else {
      console.log('Fetched events:', events);
    }
  };

  return (
    <div>
      <button onClick={handleGetCountries} className="debug-button">
        Get CAMEO Countries
      </button>
      <button onClick={handleGetEvents} className="debug-button">
        Get Events
      </button>
    </div>
  );
};

export default DebugPanel;
