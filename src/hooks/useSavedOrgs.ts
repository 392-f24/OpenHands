import useUser from './useUser';

const useSavedOrgs = () => {
  const { user, updateProfile } = useUser();

  if (!user || user.role !== 'donor') {
    return {
      savedOrgs: [],
      updateSavedOrgs: async () => {
        console.warn('This user is not a donor.');
      },
    };
  }

  const donorProfile = user as DonorProfile;
  const savedOrgs = donorProfile.saved || [];

  const updateSavedOrgs = async (org: OrganizationProfile): Promise<void> => {
    const isAlreadySaved = savedOrgs.some(
      (organization: OrganizationProfile) => organization.uid === org.uid
    );

    // If exists, remove; else add
    const updatedSaved = isAlreadySaved
      ? savedOrgs.filter(
          (organization: OrganizationProfile) => organization.uid !== org.uid
        )
      : [...savedOrgs, org];

    try {
      await updateProfile({ saved: updatedSaved });
    } catch (error) {
      console.error('Error toggling saved organization:', error);
      alert('Failed to update saved organizations. Please try again.');
    }
  };

  return { savedOrgs, updateSavedOrgs };
};

export default useSavedOrgs;
