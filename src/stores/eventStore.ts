import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/utils/firebase';

interface EventState {
  events: DonationEvent[];
  setEvents: (events: DonationEvent[]) => void;
  fetchEventsByIds: (eventIds: string[]) => Promise<void>;
}

const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [],

      setEvents: (events) => set({ events }),

      fetchEventsByIds: async (eventIds: string[]) => {
        if (!eventIds?.length) {
          console.info('No event IDs provided.');
          return;
        }

        try {
          const eventsCollection = collection(db, 'events');
          const snapshot = await getDocs(eventsCollection);

          if (!snapshot.docs?.length) {
            console.info('No events found in the collection.');
            return;
          }

          const events: DonationEvent[] = snapshot.docs
            .filter((doc) => eventIds.includes(doc.id))
            .map((doc) => ({
              ...doc.data(),
              eventId: doc.id,
            })) as DonationEvent[];

          set({ events });
        } catch (error) {
          console.error('Error fetching events by IDs:', error);
          throw error;
        }
      },
    }),
    {
      name: 'event-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useEventStore;
