import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { collection, getDocs } from 'firebase/firestore';

import useUserStore from './userStore';

import { db, updateDocument, updateEvent } from '@/utils/firebase';

interface EventState {
  events: DonationEvent[];
  setEvents: (events: DonationEvent[]) => void;
  fetchEventsByIds: (eventIds: string[]) => Promise<void>;
  addDonationEvent: (
    event: DonationEvent,
    donorUpdates: Partial<DonorProfile>,
    organizationUpdates: Partial<OrganizationProfile>
  ) => Promise<void>;
}

const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
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

      addDonationEvent: async (
        event,
        donorUpdates,
        organizationUpdates
      ): Promise<void> => {
        try {
          if (organizationUpdates.uid) {
            await updateDocument(
              'organization',
              organizationUpdates.uid,
              organizationUpdates
            );
          }

          if (donorUpdates.uid) {
            const userStore = useUserStore.getState();
            await userStore.updateProfile(donorUpdates);
          }

          await updateEvent(event);

          const currentEvents = get().events;
          set({ events: [...currentEvents, event] });

          console.info(`Donation event ${event.eventId} created successfully.`);
        } catch (error) {
          console.error('Error adding donation event:', error);
          throw new Error('Failed to create donation event.');
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
