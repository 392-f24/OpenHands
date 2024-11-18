interface UserContextType {
  user: User | undefined;
  loading: boolean;
  login: (userType: UserType, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

type UserType = 'donor' | 'organization';

interface DonorProfile {
  uid: string;
  name: string;
  profilePic: string;
  createdAt: Date;
  role: 'donor' | 'organization';
}

interface OrganizationProfile extends DonorProfile {
  location: string;
  description: string;
  website: string;
}

type User = OrganizationProfile | DonorProfile;
