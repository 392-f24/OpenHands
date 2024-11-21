import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

import { db } from './firebaseConfig';

/**
 * Fetch all events by event IDs by filtering the entire events collection.
 *
 * @param eventIds The array of event IDs to fetch.
 * @returns A promise that resolves to an array of DonationEvent.
 */
const fetchEventsByIds = async (
  eventIds: string[]
): Promise<DonationEvent[]> => {
  if (eventIds.length === 0) {
    console.info('No event IDs provided.');
    return [];
  }

  try {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);

    if (snapshot.empty) {
      console.info('No events found in the collection.');
      return [];
    }

    // Filter events based on the provided IDs
    const events: DonationEvent[] = snapshot.docs
      .filter((doc) => eventIds.includes(doc.id)) // Only keep documents matching the event IDs
      .map((doc) => ({
        ...doc.data(),
        eventId: doc.id,
      })) as DonationEvent[];

    return events;
  } catch (error) {
    console.error('Error fetching events by IDs:', error);
    throw error;
  }
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

export { fetchEventsByIds, updateEvent, removeEvent };
