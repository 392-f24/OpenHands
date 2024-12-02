import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';
import { useLocalStorage, useSessionStorage } from '@zl-asica/react';

import LoadingCircle from '@/components/common/LoadingCircle';

import {
  loginUser,
  logoutUser,
  auth,
  updateDocument,
  fetchAllOrganizationProfiles,
  fetchEventsByIds,
  getOrCreateDocument,
} from '@/utils/firebase';

interface UserContextType {
  user: User | undefined;
  organizationProfiles: OrganizationProfile[];
  events: DonationEvent[];
  setEvents: (events: DonationEvent[]) => void;
  loading: boolean;
  login: (userType: UserType, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  fetchDonorById: (donorId: string) => Promise<DonorProfile | undefined>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { value: user, setValue: setUser } = useLocalStorage<User | undefined>(
    'user',
    // eslint-disable-next-line unicorn/no-useless-undefined
    undefined
  );
  const { value: organizationProfiles, setValue: setOrganizationProfiles } =
    useSessionStorage<OrganizationProfile[]>('organizationProfiles', []);
  const { value: events, setValue: setEvents } = useSessionStorage<
    DonationEvent[]
  >('events', []);

  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const fetchProfiles = async () => {
      const tempOrganizationProfiles = await fetchAllOrganizationProfiles();
      setOrganizationProfiles(tempOrganizationProfiles);
    };

    fetchProfiles();

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (user) {
          const fetchedEvents = await fetchEventsByIds(user.joinedEvents);
          setEvents(fetchedEvents);
        } else {
          // if user logged in but not in local storage
          // clear user and let the user login again
          setUser(undefined);
        }
      } else {
        setUser(undefined); // Clear user state on logout
      }
      setLoading(false); // Stop loading spinner
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Handle login
  const login = async (
    userType: 'donor' | 'organization',
    navigate: NavigateFunction
  ): Promise<void> => {
    try {
      setLoading(true);
      const profile = await loginUser(navigate, userType);
      if (profile) {
        setUser({
          ...profile,
          role: userType, // Attach user role
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
    setLoading(false);
  };

  // Handle logout
  const logout = async (navigate: NavigateFunction): Promise<void> => {
    try {
      setLoading(true);
      await logoutUser(navigate);
      setUser(undefined); // Clear user state
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
    setLoading(false);
  };

  // Handle profile update
  const updateProfile = async <T extends User>(
    updates: Partial<T>
  ): Promise<void> => {
    if (!user) {
      console.error('No user is currently logged in.');
      return;
    }

    try {
      await updateDocument<T>(user.role, user.uid, updates);
      setUser((prev) => (prev ? { ...prev, ...updates } : undefined)); // Update local state
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile update failed. Please try again.');
    }
  };
  /**
   * Fetch donor profile using `getOrCreateDocument`.
   *
   * @param donorId - The UID of the donor.
   * @returns The donor profile if it exists
   */
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const fetchDonorById = async (
    donorId: string
  ): Promise<DonorProfile | undefined> => {
    // Default donor data, used only if the document does not exist
    const defaultDonorData: DonorProfile = {
      uid: donorId,
      name: 'Unknown Donor', // Placeholder name
      email: '',
      profilePic: '',
      joinedEvents: [],
      providedSupplies: [],
      saved: [],
      role: 'donor',
      createdAt: new Date().toISOString(), // Add the createdAt field
    };

    return await getOrCreateDocument<DonorProfile>(donorId, defaultDonorData);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        organizationProfiles,
        events,
        setEvents,
        loading,
        login,
        logout,
        updateProfile,
        fetchDonorById,
      }}
    >
      {loading ? <LoadingCircle /> : children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
