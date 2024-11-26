import useUser from './useUser';

interface UseNeedsHook {
  addNeed: (
    organizationId: string,
    itemName: string,
    quantityNeeded: number,
    pickup?: boolean,
    loanable?: boolean,
    returnDate?: string
  ) => Promise<void>;
  updateNeed: (
    organizationId: string,
    itemName: string,
    updates: Partial<Supply>
  ) => Promise<void>;
}

const sanitizeNeeds = (needs: Supply[]): Supply[] =>
  needs.map((need) => ({
    itemName: need.itemName,
    quantityNeeded: need.quantityNeeded,
    quantityProvided: need.quantityProvided,
    providedBy: need.providedBy,
    status: need.status,
    pickup: need.pickup,
    loanable: need.loanable,
    ...(need.loanable ? { returnDate: need.returnDate } : {}),
  }));

const useNeeds = (): UseNeedsHook => {
  const { organizationProfiles, updateProfile } = useUser();

  const findOrganizationProfile = (
    organizationId: string
  ): OrganizationProfile | null => {
    const orgProfile = organizationProfiles.find(
      (org) => org.uid === organizationId
    );
    if (!orgProfile) {
      console.error(`Organization with ID ${organizationId} not found.`);
      return null;
    }
    return orgProfile;
  };

  const addNeed = async (
    organizationId: string,
    itemName: string,
    quantityNeeded: number,
    pickup = false,
    loanable = false,
    returnDate?: string
  ): Promise<void> => {
    const orgProfile = findOrganizationProfile(organizationId);
    if (!orgProfile) return;

    const newNeed: Supply = {
      itemName,
      quantityNeeded,
      quantityProvided: 0,
      providedBy: [],
      status: false,
      pickup,
      loanable,
      ...(loanable && returnDate ? { returnDate } : {}),
    };

    try {
      const updatedNeeds = sanitizeNeeds([...orgProfile.needs, newNeed]);
      await updateProfile({ needs: updatedNeeds });
      console.log(`Successfully added new need: ${itemName}`);
    } catch (error_) {
      console.error('Error adding new need:', error_);
    }
  };

  const updateNeed = async (
    organizationId: string,
    itemName: string,
    updates: Partial<Supply>
  ): Promise<void> => {
    const orgProfile = findOrganizationProfile(organizationId);
    if (!orgProfile) return;

    try {
      const needIndex = orgProfile.needs.findIndex(
        (need) => need.itemName === itemName
      );

      if (needIndex === -1) {
        console.error(`Need with itemName ${itemName} not found.`);
        return;
      }

      const updatedNeeds = [...orgProfile.needs];
      updatedNeeds[needIndex] = { ...updatedNeeds[needIndex], ...updates };
      const sanitizedNeeds = sanitizeNeeds(updatedNeeds);

      await updateProfile({ needs: sanitizedNeeds });
      console.log(`Successfully updated need: ${itemName}`);
    } catch (error_) {
      console.error('Error updating need:', error_);
    }
  };

  return { addNeed, updateNeed };
};

export default useNeeds;
