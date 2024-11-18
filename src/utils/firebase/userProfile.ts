import { getOrCreateDocument } from './firebaseUtils';

const getDonorProfile = async (
  uid: string,
  email: string, // Login email from authentication
  photoURL?: string,
  displayName?: string
): Promise<DonorProfile | undefined> => {
  const defaultProfile: DonorProfile = {
    uid,
    name: displayName || '',
    email, // Store the login email
    profilePic: photoURL || '',
    createdAt: new Date(),
    role: 'donor',
    joinedEvents: [], // Initialize as an empty array for joined event IDs
    providedSupplies: [], // Initialize as an empty array for provided supplies
  };

  return getOrCreateDocument<DonorProfile>('users', uid, defaultProfile);
};

const getOrganizationProfile = async (
  uid: string,
  email: string, // Login email for the organization
  photoURL?: string,
  displayName?: string,
  location?: string,
  description?: string,
  website?: string
): Promise<OrganizationProfile | undefined> => {
  const defaultProfile: OrganizationProfile = {
    uid,
    name: displayName || '',
    email, // Store the login email
    profilePic: photoURL || '',
    createdAt: new Date(),
    role: 'organization',
    location: location || '', // Default to an empty string if not provided
    description: description || '', // Default to an empty string if not provided
    website: website || '', // Default to an empty string if not provided
    events: [], // Initialize as an empty array for events
  };

  return getOrCreateDocument<OrganizationProfile>(
    'organizations',
    uid,
    defaultProfile
  );
};

export { getDonorProfile, getOrganizationProfile };
