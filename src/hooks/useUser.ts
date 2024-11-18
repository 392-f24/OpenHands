import { useContext } from 'react';

import { UserContest } from '@/context/UserContext';

const useUser = () => useContext(UserContest);

export default useUser;
