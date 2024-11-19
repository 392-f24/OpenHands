import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { NavigateFunction } from 'react-router-dom';

import LoadingCircle from '@/components/common/LoadingCircle';

import { loginUser, logoutUser, auth, updateDocument } from '@/utils/firebase';
import getUserProfile from '@/utils/firebase/userProfile';

interface UserContextType {
  user: User | undefined;
  loading: boolean;
  login: (userType: UserType, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(() => {
    // Load user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : undefined;
  });
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!user) {
          // Only fetch if the user is not already loaded
          const role = localStorage.getItem('userRole') as UserType;
          const profile = await getUserProfile(firebaseUser, role, () => {});
          if (profile) {
            const updatedUser = { ...profile, uid: firebaseUser.uid, role };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      } else {
        setUser(undefined);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle login
  const login = async (
    userType: UserType,
    navigate: NavigateFunction
  ): Promise<void> => {
    try {
      setLoading(true);
      localStorage.setItem('userRole', userType); // Save role to localStorage
      const profile = await loginUser(navigate, userType);
      if (profile) {
        const updatedUser = { ...profile, role: userType };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
      setUser(undefined);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
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
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser); // Update local state
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist to localStorage
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
