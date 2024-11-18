import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/utils/firebaseConfig';

export const createOrganizationProfile = async (
  uid: string,
  photoURL?: string,
  displayName?: string,
  location?: string,
  description?: string,
  website?: string
) => {
  const defaultProfile = {
    uid,
    profilePic: photoURL || '',
    name: displayName || '',
    location: location || '',
    description: description || '',
    website: website || '',
    createdAt: new Date(),
  };

  try {
    const orgRef = doc(db, 'organizations', uid);
    const orgSnap = await getDoc(orgRef);

    if (orgSnap.exists()) {
      console.info('Organization profile already exists.');
    } else {
      await setDoc(orgRef, defaultProfile);
      console.info('New organization profile created.');
    }
  } catch (error) {
    console.error('Error creating organization profile:', error);
  }
};
