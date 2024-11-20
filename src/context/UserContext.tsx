import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';
import { useLocalStorage } from '@zl-asica/react';

import LoadingCircle from '@/components/common/LoadingCircle';

import { loginUser, logoutUser, auth, updateDocument } from '@/utils/firebase';

interface UserContextType {
  user: User | undefined;
  loading: boolean;
  login: (userType: UserType, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { value: user, setValue: setUser } = useLocalStorage<User | undefined>(
    'user',
    // eslint-disable-next-line
    undefined
  );
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!user) {
          // if user logged in but not in local storage
          // clear user and let the user login again
          setUser(undefined);
        }
      } else {
        setUser(undefined); // Clear user state on logout
      }
      setLoading(false); // Stop loading spinner
    });

    return () => unsubscribe();
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
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      console.error('No user is currently logged in.');
      return;
    }

    try {
      const collectionName = user.role;
      await updateDocument<User>(collectionName, user.uid, updates);
      setUser((prev) => (prev ? { ...prev, ...updates } : undefined)); // Update local state
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile update failed. Please try again.');
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, login, logout, updateProfile }}
    >
      {loading ? <LoadingCircle /> : children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
