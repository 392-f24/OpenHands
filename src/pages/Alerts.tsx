import { useUser } from '@/hooks';

import { DonorAlerts, OrganizationAlerts } from '@/components/Alerts';

const Alerts = () => {
  const { user } = useUser();

  if (user && user.role === 'organization') {
    return <OrganizationAlerts />;
  }

  return <DonorAlerts />;
};

export default Alerts;
