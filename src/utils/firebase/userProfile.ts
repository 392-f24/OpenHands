import type { User } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';

import { getOrCreateDocument } from './firebaseUtils';

const getUserProfile = async (
  user: User,
  role: 'donor' | 'organization',
  navigate: NavigateFunction
): Promise<DonorProfile | OrganizationProfile | undefined> => {
  const { uid, email, photoURL, displayName } = user;

  const userProfile =
    role === 'donor'
      ? getDonorProfile(
          uid,
          email as string,
          photoURL as string,
          displayName as string
        )
      : getOrganizationProfile(
          uid,
          email as string,
          photoURL as string,
          displayName as string
        );

  if (role === 'donor' || !userProfile) {
    navigate('/');
  } else if (role === 'organization') {
    navigate('/organization-dashboard');
  }

  return userProfile;
};

const getDonorProfile = async (
  uid: string,
  email: string, // Login email from authentication
  photoURL: string,
  displayName: string
): Promise<DonorProfile | undefined> => {
  const defaultProfile: DonorProfile = {
    uid,
    name: displayName,
    email, // Store the login email
    profilePic: photoURL,
    createdAt: new Date(),
    role: 'donor',
    joinedEvents: [], // Initialize empty array
    providedSupplies: [], // Initialize empty array
  };

  return getOrCreateDocument<DonorProfile>('users', uid, defaultProfile);
};

const getOrganizationProfile = async (
  uid: string,
  email: string, // Login email for the organization
  photoURL: string,
  displayName: string
): Promise<OrganizationProfile | undefined> => {
  const defaultProfile: OrganizationProfile = {
    uid,
    name: displayName,
    email, // Store the login email
    profilePic: photoURL,
    createdAt: new Date(),
    role: 'organization',
    location: '', // Default empty string
    description: '', // Default empty string
    website: '', // Default empty string
    events: [], // Initialize empty array
  };

  return getOrCreateDocument<OrganizationProfile>(
    'organizations',
    uid,
    defaultProfile
  );
};

export default getUserProfile;
