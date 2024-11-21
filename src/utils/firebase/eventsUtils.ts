import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

import { db } from './firebaseConfig';

/**
 * Listen to all events by event IDs.
 *
 * @param eventIds The array of event IDs to listen for.
 * @param callback A function to update the state with the latest events data.
 * @returns A cleanup function to unsubscribe from the Firestore listener.
 */
const listenToEventsByIds = (
  eventIds: string[],
  callback: (events: DonationEvent[]) => void
): (() => void) => {
  const eventsCollection = collection(db, 'events');
  const unsubscribes: (() => void)[] = [];

  for (const eventId of eventIds) {
    const eventRef = doc(eventsCollection, eventId);

    const unsubscribe = onSnapshot(eventRef, (eventSnap) => {
      if (eventSnap.exists()) {
        const updatedEvent = {
          ...eventSnap.data(),
          eventId,
        } as DonationEvent;

        callback([updatedEvent]);
      }
    });

    unsubscribes.push(unsubscribe);
  }

  // Cleanup function to unsubscribe all listeners
  return () => {
    for (const unsubscribe of unsubscribes) unsubscribe();
  };
};

/**
 * Add or update an event in the Firestore `events` collection.
 *
 * @param event The DonationEvent object to be added or updated.
 * @returns A promise that resolves when the event is updated.
 */
const updateEvent = async (event: DonationEvent): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', event.eventId);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      // Merge updates with the existing event
      await setDoc(
        eventRef,
        { ...eventSnap.data(), ...event },
        { merge: true }
      );
      console.info(`Event ${event.eventId} updated successfully.`);
    } else {
      // Create a new event
      await setDoc(eventRef, event);
      console.info(`Event ${event.eventId} added successfully.`);
    }
  } catch (error) {
    console.error('Error updating event:', error);
    throw error; // Rethrow error for caller to handle
  }
};

/**
 * Remove an event from the Firestore `events` collection.
 *
 * @param eventId The ID of the event to be removed.
 * @returns A promise that resolves when the event is removed.
 */
const removeEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    console.info(`Event ${eventId} removed successfully.`);
  } catch (error) {
    console.error(`Error removing event ${eventId}:`, error);
    throw error; // Rethrow error for caller to handle
  }
};

export { listenToEventsByIds, updateEvent, removeEvent };
