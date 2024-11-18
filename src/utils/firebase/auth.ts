import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';

import { getDonorProfile, getOrganizationProfile } from './userProfile';
import { auth } from './firebaseConfig';

const loginUser = async (
  navigate: NavigateFunction,
  userType: 'donor' | 'organization'
): Promise<DonorProfile | OrganizationProfile | undefined> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const photoURL = user.photoURL ?? '';
    const displayName = user.displayName ?? '';

    if (userType === 'donor') {
      const donorProfile = await getDonorProfile(
        user.uid,
        photoURL,
        displayName
      );
      navigate('/');
      return donorProfile;
    } else {
      const organizationProfile = await getOrganizationProfile(
        user.uid,
        photoURL,
        displayName
      );
      navigate('/organization-dashboard');
      return organizationProfile;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return undefined;
  }
};

const logoutUser = async (navigate: NavigateFunction): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    navigate('/');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

export { loginUser, logoutUser };
