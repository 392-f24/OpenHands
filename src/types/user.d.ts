type UserType = 'donor' | 'organization';

interface BasicProfile {
  uid: string;
  name: string;
  email: string;
  profilePic: string;
  createdAt: Date;
  role: UserType;
}

interface DonorProfile extends BasicProfile {
  joinedEvents: string[]; // array of eventIds
  providedSupplies: {
    eventId: string;
    itemName: string;
    quantityProvided: number;
    organizationId: string;
  }[];
}

interface OrganizationProfile extends BasicProfile {
  location: string;
  description: string;
  website: string;
  events: {
    eventId: string;
    title: string;
    description: string;
    date: Date;
    supplies: {
      itemName: string;
      quantityNeeded: number;
      quantityProvided: number;
      providedBy: string[]; // array of uid of donors
      status: 'needed' | 'fulfilled';
    }[];
  }[];
}

type User = OrganizationProfile | DonorProfile;
