/**
 * Generate updated organization needs.
 */
const generateUpdatedNeeds = (
  organization: OrganizationProfile,
  selectedNeeds: string[],
  providedQuantities: { [key: string]: number },
  donorId: string
) =>
  organization.needs?.map((need) => {
    if (selectedNeeds.includes(need.itemName)) {
      const quantityProvided = providedQuantities[need.itemName] || 0;
      const remainingQuantity = need.quantityNeeded - quantityProvided;

      return {
        ...need,
        quantityNeeded: Math.max(0, remainingQuantity),
        quantityProvided: need.quantityProvided + quantityProvided,
        providedBy: need.providedBy.includes(donorId)
          ? need.providedBy
          : [...need.providedBy, donorId],
        status: remainingQuantity === 0,
      };
    }
    return need;
  });

/**
 * Create a new donation event object.
 */
const createDonationEvent = (
  organization: OrganizationProfile,
  donor: DonorProfile,
  selectedNeeds: string[],
  providedQuantities: { [key: string]: number },
  formattedDate: string,
  method: string
): DonationEvent => ({
  eventId: `${organization.uid}-${donor.uid}-${new Date().toISOString()}`,
  organizationId: organization.uid,
  donorId: donor.uid,
  title: `To ${organization.name} from ${donor.name}`,
  description: `Donation of items: ${selectedNeeds.join(', ')}`,
  date: formattedDate,
  supplies: selectedNeeds.map((itemName) => {
    const supply =
      organization.needs?.find((n) => n.itemName === itemName) || null;
    return {
      itemName,
      quantityNeeded: supply?.quantityNeeded || 1,
      quantityProvided: providedQuantities[itemName] || 1,
      providedBy: [donor.uid],
      status: (supply?.quantityNeeded ?? 0) > 0,
      pickup: method === 'pick-up',
      loanable: supply?.loanable || false,
      returnDate: supply?.loanable ? supply.returnDate || '' : '',
      createdAt: new Date().toISOString(),
    };
  }),
});

/**
 * Generate donor's supply updates.
 */
const generateDonorSupplies = (
  newEvent: DonationEvent,
  organizationId: string
) =>
  newEvent.supplies.map((supply) => ({
    eventId: newEvent.eventId,
    itemName: supply.itemName,
    quantityProvided: supply.quantityProvided,
    organizationId,
  }));

/**
 * Prepare donation-related data for updates.
 */
const prepareDonationData = (
  organization: OrganizationProfile,
  donor: DonorProfile,
  selectedNeeds: string[],
  providedQuantities: { [key: string]: number },
  formattedDate: string,
  method: string
) => {
  const updatedNeeds = generateUpdatedNeeds(
    organization,
    selectedNeeds,
    providedQuantities,
    donor.uid
  );

  const newEvent = createDonationEvent(
    organization,
    donor,
    selectedNeeds,
    providedQuantities,
    formattedDate,
    method
  );

  const donorUpdates = {
    uid: donor.uid,
    joinedEvents: [...donor.joinedEvents, newEvent.eventId],
    providedSupplies: generateDonorSupplies(newEvent, organization.uid),
  };

  const organizationUpdates = {
    uid: organization.uid,
    needs: updatedNeeds,
    joinedEvents: [...organization.joinedEvents, newEvent.eventId],
  };

  return { newEvent, donorUpdates, organizationUpdates };
};

export default prepareDonationData;
