import { useUser } from '@/hooks';

import OrganizationDashboard from '@/components/Home/OrganizationDashboard';
import DonorDashboard from '@/components/Home/DonorDashboard';

const Home = () => {
  const { user } = useUser();

  if (user && user.role === 'organization') {
    return <OrganizationDashboard />;
  }

  return <DonorDashboard />;
};

export default Home;
