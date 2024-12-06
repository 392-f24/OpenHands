import type { DocumentData, WithFieldValue } from 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
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
  uid: string,
  defaultData: T
): Promise<T | undefined> => {
  const collectionName = defaultData.role;

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

const getOrDefaultDocuments = async <T extends WithFieldValue<DocumentData>>(
  uids: string[],
  defaultData: T
): Promise<T[]> => {
  const results: T[] = [];
  const BATCH_SIZE = 10; // Firestore `in` query limit
  const collectionName = defaultData.role;

  try {
    const existingDocs: Record<string, T> = {};

    // Split UIDs into batches to respect Firestore's `in` query limit
    const batches = [];
    for (let i = 0; i < uids.length; i += BATCH_SIZE) {
      batches.push(uids.slice(i, i + BATCH_SIZE));
    }

    // Fetch existing documents in batches
    for (const batch of batches) {
      const docsQuery = query(
        collection(db, collectionName),
        where('__name__', 'in', batch)
      );
      const querySnapshot = await getDocs(docsQuery);
      // eslint-disable-next-line unicorn/no-array-for-each
      querySnapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          existingDocs[docSnap.id] = docSnap.data() as T;
        }
      });
    }

    // Map UIDs to their corresponding documents or default data
    for (const uid of uids) {
      results.push(existingDocs[uid] || { ...defaultData, id: uid });
    }
  } catch (error) {
    console.error(
      `Error in getOrDefaultDocuments for ${collectionName}:`,
      error
    );
  }

  return results;
};

export { getOrCreateDocument, updateDocument, getOrDefaultDocuments };
