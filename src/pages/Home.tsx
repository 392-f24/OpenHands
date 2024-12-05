import { useUserStore } from '@/stores';

import OrganizationDashboard from '@/components/Home/OrganizationDashboard';
import DonorDashboard from '@/components/Home/DonorDashboard';

const Home = () => {
  const user = useUserStore((state) => state.user);

  if (user && user.role === 'organization') {
    return <OrganizationDashboard />;
  }

  return <DonorDashboard />;
};

export default Home;
