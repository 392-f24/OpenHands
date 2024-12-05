import { useEventStore, useUserStore } from '@/stores';

import { updateEvent, updateDocument } from '@/utils/firebase';

const useEvents = () => {
  const events = useEventStore((store) => store.events);
  const setEvents = useEventStore((store) => store.setEvents);
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);

  if (!user) {
    return {
      events: [],
      addDonationEvent: async () => {
        console.warn('No user logged in.');
      },
    };
  }

  const addDonationEvent = async (
    event: DonationEvent,
    donorUpdates: Partial<DonorProfile>,
    organizationUpdates: Partial<OrganizationProfile>
  ): Promise<void> => {
    try {
      // Step 1: Update the organization's profile (needs and joinedEvents)
      if (organizationUpdates.uid) {
        await updateDocument(
          'organization',
          organizationUpdates.uid,
          organizationUpdates
        );
      }

      // Step 2: Update the donor's profile (providedSupplies and joinedEvents)
      if (donorUpdates.uid) {
        await updateProfile(donorUpdates);
      }

      // Step 3: Save the event in Firestore
      await updateEvent(event);

      // Step 4: Update local state with the new event
      setEvents([...events, event]);

      console.info(`Donation event ${event.eventId} created successfully.`);
    } catch (error) {
      console.error('Error adding donation event:', error);
      throw new Error('Failed to create donation event.');
    }
  };

  return {
    events,
    addDonationEvent,
  };
};

export default useEvents;
