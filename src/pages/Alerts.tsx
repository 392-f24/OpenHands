import { useUserStore } from '@/stores';

import { DonorAlerts, OrganizationAlerts } from '@/components/Alerts';

const Alerts = () => {
  const user = useUserStore((state) => state.user);

  if (user && user.role === 'organization') {
    return <OrganizationAlerts />;
  }

  return <DonorAlerts />;
};

export default Alerts;
