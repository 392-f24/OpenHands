import React, { createContext } from 'react';

import LoadingCircle from '@/components/common/LoadingCircle';

interface UserContext {
  user: User | undefined;
  loading: boolean;
}

const UserContest = createContext<UserContext>({} as UserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const user = {
    uid: '123',
    username: 'Peter Anteater',
    profilePicture: '',
  };
  const loading = false;

  return (
    <UserContest.Provider value={{ user, loading }}>
      {loading ? <LoadingCircle /> : children}
    </UserContest.Provider>
  );
};

export { UserContest, UserProvider };
