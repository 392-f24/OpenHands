import type { User } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';

import { createDonorProfile } from './userProfile';
import { createOrganizationProfile } from './organizationProfile';

import { auth } from '@/utils/firebaseConfig';

/**
 * Handle user login with role selection.
 */
const handleLogin = async (
  navigate: NavigateFunction,
  userType: 'donor' | 'organization'
): Promise<void> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user: User = result.user;

    // Convert `null` to `undefined` for compatibility
    const photoURL = user.photoURL ?? undefined;
    const displayName = user.displayName ?? undefined;

    if (userType === 'donor') {
      await createDonorProfile(user.uid, photoURL, displayName);
      navigate('/');
    } else if (userType === 'organization') {
      await createOrganizationProfile(user.uid, photoURL, displayName);
      navigate('/organization-dashboard');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Login failed. Please try again.');
  }
};

/**
 * Handle user sign-out.
 */
const handleSignOut = async (navigate: NavigateFunction): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    navigate('/'); // Redirect to home page or login page
  } catch (error) {
    console.error('Error during sign-out:', error);
    alert('Sign-out failed. Please try again.');
  }
};

// Consolidated exports
export { handleLogin, handleSignOut };
