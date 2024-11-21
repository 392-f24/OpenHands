import useUser from './useUser';

import { updateEvent, removeEvent } from '@/utils/firebase';

const useEvents = () => {
  const { user, updateProfile } = useUser();

  if (!user) {
    return {
      events: [],
      addOrUpdateEvent: async () => {
        console.warn('No user logged in.');
      },
      removeEvent: async () => {
        console.warn('No user logged in.');
      },
    };
  }

  const { joinedEvents = [] } = user;

  const addOrUpdateEvent = async (event: DonationEvent): Promise<void> => {
    const isAlreadyJoined = joinedEvents.includes(event.eventId);

    const updatedEvents = isAlreadyJoined
      ? joinedEvents
      : [...joinedEvents, event.eventId];

    try {
      // Update the user profile's joinedEvents
      await updateProfile({ joinedEvents: updatedEvents });

      // Add or update the event in the Firestore collection
      await updateEvent(event);

      console.info(
        isAlreadyJoined
          ? `Event ${event.eventId} updated successfully.`
          : `Event ${event.eventId} added successfully.`
      );
    } catch (error) {
      console.error('Error adding/updating event:', error);
      alert('Failed to add/update event. Please try again.');
    }
  };

  const removeEventFromUser = async (eventId: string): Promise<void> => {
    const updatedEvents = joinedEvents.filter((id) => id !== eventId);

    try {
      // Update the user profile's joinedEvents
      await updateProfile({ joinedEvents: updatedEvents });

      // Remove the event from the Firestore collection
      await removeEvent(eventId);
    } catch (error) {
      console.error('Error removing event:', error);
      alert('Failed to remove event. Please try again.');
    }
  };

  return {
    events: joinedEvents, // Return user's joined events (IDs only)
    addOrUpdateEvent,
    removeEvent: removeEventFromUser,
  };
};

export default useEvents;
