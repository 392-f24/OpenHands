import { createContext, useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

import LoadingCircle from '@/components/common/LoadingCircle';

import { auth } from '@/utils/firebaseConfig';

interface User {
  uid: string;
  username: string;
  profilePicture: string;
}

interface UserContext {
  user: User | undefined;
  loading: boolean;
}

const UserContext = createContext<UserContext>({} as UserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Set the authenticated user's information
          setUser({
            uid: firebaseUser.uid,
            username: firebaseUser.displayName || 'Anonymous',
            profilePicture: firebaseUser.photoURL || '',
          });
        } else {
          // No user is authenticated
          setUser(undefined);
        }
        setLoading(false); // Authentication check is complete
      }
    );

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {loading ? <LoadingCircle /> : children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
