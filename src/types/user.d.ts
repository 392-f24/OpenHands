type UserType = 'donor' | 'organization';

interface BasicProfile {
  uid: string;
  name: string;
  email: string;
  profilePic: string;
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

interface Event {
  eventId: string;
  title: string;
  description: string;
  date: Date;
  supplies: Supply[];
}

interface DonorProfile extends BasicProfile {
  joinedEvents: string[]; // array of eventIds
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
  events: Event[];
  needs: string[];
  loanable: boolean;
  pickup: boolean;
}

type User = DonorProfile | OrganizationProfile;
