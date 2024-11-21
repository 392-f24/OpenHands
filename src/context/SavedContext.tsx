import { createContext, useState, useContext, useEffect } from 'react';

import { UserContext } from '@/context/UserContext';

interface SavedContextProps {
  savedOrgs: OrganizationProfile[];
  toggleSavedOrg: (org: OrganizationProfile) => void;
}

const SavedContext = createContext<SavedContextProps | undefined>(undefined);

const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedOrgs, setSavedOrgs] = useState<OrganizationProfile[]>([]);
  const { user, updateProfile } = useContext(UserContext);

  useEffect(() => {
    if (user?.role === 'donor') {
      // Populate savedOrgs from the user's `saved` array
      const donorProfile = user as DonorProfile;
      setSavedOrgs(donorProfile.saved || []);
    }
  }, [user]);

  const toggleSavedOrg = async (org: OrganizationProfile): Promise<void> => {
    if (!user || user.role !== 'donor') return;

    const donorProfile = user as DonorProfile;
    const savedArray = donorProfile.saved || [];

    const updatedSaved =
      savedArray.length > 0
        ? savedArray.some((o) => o.uid === org.uid)
          ? savedArray.filter((o) => o.uid !== org.uid)
          : [...savedArray, org]
        : [org];

    try {
      await updateProfile({ saved: updatedSaved });
      setSavedOrgs(updatedSaved);
    } catch (error) {
      console.error('Error toggling saved organization:', error);
      alert('Failed to update saved organizations. Please try again.');
    }
  };

  return (
    <SavedContext.Provider value={{ savedOrgs, toggleSavedOrg }}>
      {children}
    </SavedContext.Provider>
  );
};

export { SavedContext, SavedProvider };
