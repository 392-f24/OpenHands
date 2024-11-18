import { createContext, useState } from 'react';

interface EventsContextType {
  events: ScheduledDonation[];
  addEvent: (newEvent: ScheduledDonation) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<ScheduledDonation[]>([]);

  const addEvent = (newEvent: ScheduledDonation) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export { EventsContext, EventsProvider };
