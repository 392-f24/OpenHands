import type { DocumentData, WithFieldValue } from 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';

import { db } from './firebaseConfig';

/**
 * Get a document from Firestore or create it if it doesn't exist.
 *
 * @param collectionName The Firestore collection name.
 * @param uid The unique identifier for the document.
 * @param defaultData The default data to create the document with if it doesn't exist.
 * @returns The existing or newly created document data.
 */
const getOrCreateDocument = async <T extends WithFieldValue<DocumentData>>(
  collectionName: string,
  uid: string,
  defaultData: T
): Promise<T | undefined> => {
  try {
    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as T; // Return existing document data
    }

    await setDoc(docRef, defaultData);
    console.info(`New ${collectionName} profile created.`);
    return defaultData; // Return the newly created document data
  } catch (error) {
    console.error(`Error in getOrCreateDocument for ${collectionName}:`, error);
    return undefined; // Return undefined on failure
  }
};

/**
 * Update a document in Firestore.
 *
 * @param collectionName The Firestore collection name.
 * @param uid The unique identifier for the document.
 * @param updates The data to update in the document.
 * @returns A promise that resolves when the update is complete.
 */
const updateDocument = async <T>(
  collectionName: string,
  uid: string,
  updates: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, uid);
    await setDoc(docRef, updates, { merge: true }); // Merge updates with existing data
    console.info(`Document in ${collectionName} updated successfully.`);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error; // Rethrow error to be handled by caller
  }
};

/**
 * Listen to all organization profiles in Firestore.
 *
 * @param callback A function to update the state with the latest organization profiles.
 * @returns A function to unsubscribe from the Firestore listener.
 */
const getAllOrganizationProfiles = (
  callback: (profiles: OrganizationProfile[]) => void
): (() => void) => {
  try {
    const organizationsCollection = collection(db, 'organizations');

    // Subscribe to Firestore collection updates
    const unsubscribe = onSnapshot(organizationsCollection, (snapshot) => {
      if (snapshot.empty) {
        console.info('No organization profiles found.');
        callback([]);
        return;
      }

      const profiles: OrganizationProfile[] = snapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as OrganizationProfile;
      });

      callback(profiles);
    });

    return unsubscribe; // cleanup
  } catch (error) {
    console.error('Error listening to organization profiles:', error);
    throw error;
  }
};

export { getOrCreateDocument, updateDocument, getAllOrganizationProfiles };
