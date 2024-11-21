type UserType = 'donor' | 'organization';

interface BasicProfile {
  uid: string;
  name: string;
  email: string;
  profilePic: string;
  joinedEvents: string[];
  createdAt: Date;
  role: UserType;
}

interface Supply {
  itemName: string;
  quantityNeeded: number;
  quantityProvided: number;
  providedBy: string[]; // array of uid of donors
  status: boolean;
}

interface DonationEvent {
  eventId: string; // Unique identifier
  organizationId: string;
  title: string;
  description: string;
  date: Date;
  donorId: string;
  supplies: Supply[];
}

interface DonorProfile extends BasicProfile {
  providedSupplies: Array<{
    eventId: string;
    itemName: string;
    quantityProvided: number;
    organizationId: string;
  }>;
  saved: OrganizationProfile[];
}

interface OrganizationProfile extends BasicProfile {
  location: string;
  description: string;
  website: string;
  needs: string[];
  loanable: boolean;
  pickup: boolean;
}

type User = DonorProfile | OrganizationProfile;
