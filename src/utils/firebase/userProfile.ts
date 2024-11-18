import { getOrCreateDocument } from './firebaseUtils';

const getDonorProfile = async (
  uid: string,
  photoURL?: string,
  displayName?: string
): Promise<DonorProfile | undefined> => {
  const defaultProfile: DonorProfile = {
    uid,
    profilePic: photoURL || '',
    name: displayName || '',
    createdAt: new Date(),
    role: 'donor',
  };

  return getOrCreateDocument<DonorProfile>('users', uid, defaultProfile);
};

const getOrganizationProfile = async (
  uid: string,
  photoURL?: string,
  displayName?: string,
  location?: string,
  description?: string,
  website?: string
): Promise<OrganizationProfile | undefined> => {
  const defaultProfile: OrganizationProfile = {
    uid,
    profilePic: photoURL || '',
    name: displayName || '',
    location: location || '',
    description: description || '',
    website: website || '',
    createdAt: new Date(),
    role: 'organization',
  };

  return getOrCreateDocument<OrganizationProfile>(
    'organizations',
    uid,
    defaultProfile
  );
};

export { getDonorProfile, getOrganizationProfile };
