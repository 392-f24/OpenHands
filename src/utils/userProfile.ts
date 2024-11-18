import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/utils/firebaseConfig';

export const createDonorProfile = async (
  uid: string,
  photoURL?: string,
  displayName?: string
) => {
  const defaultProfile = {
    uid,
    profilePic: photoURL || '',
    name: displayName || '',
    createdAt: new Date(),
  };

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.info('Donor profile already exists.');
    } else {
      await setDoc(userRef, defaultProfile);
      console.info('New donor profile created.');
    }
  } catch (error) {
    console.error('Error creating donor profile:', error);
  }
};
