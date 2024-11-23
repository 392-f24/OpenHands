import type { User } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';

import { getOrCreateDocument } from './firebaseUtils';

const createDefaultProfile = (
  role: UserType,
  basicData: Partial<BasicProfile>
): DonorProfile | OrganizationProfile => {
  const baseProfile = {
    uid: basicData.uid as string,
    name: basicData.name as string,
    email: basicData.email as string,
    profilePic: basicData.profilePic as string,
    joinedEvents: [],
    createdAt: new Date(),
    role,
  };

  if (role === 'donor') {
    return {
      ...baseProfile,
      providedSupplies: [],
      saved: [],
    };
  }

  return {
    ...baseProfile,
    location: '',
    description: '',
    website: '',
    needs: [],
  };
};

const getUserProfile = async (
  user: User,
  role: UserType,
  navigate: NavigateFunction
): Promise<DonorProfile | OrganizationProfile | undefined> => {
  const { uid, email, photoURL, displayName } = user;

  const defaultProfile = createDefaultProfile(role, {
    uid,
    email: email as string,
    profilePic: photoURL || '',
    name: displayName || 'Unnamed User',
  });

  const userProfile =
    role === 'donor'
      ? await getOrCreateDocument<DonorProfile>(
          uid,
          defaultProfile as DonorProfile
        )
      : await getOrCreateDocument<OrganizationProfile>(
          uid,
          defaultProfile as OrganizationProfile
        );

  navigate('/');

  return userProfile;
};

export default getUserProfile;
