import { useUserStore } from '@/stores';

import ScheduleBase from '@/components/Schedule';

const DonorSchedule = () => {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const title =
    user.role === 'donor'
      ? 'Your Donation Schedule'
      : 'Your Organization Events';
  const description =
    user.role === 'donor'
      ? 'View and manage your scheduled donations.'
      : 'View and manage your organization’s upcoming events.';

  return (
    <ScheduleBase
      title={title}
      description={description}
    />
  );
};

export default DonorSchedule;
