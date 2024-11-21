import { useUser } from '@/hooks';

import ScheduleBase from '@/components/Schedule';

const DonorSchedule = () => {
  const { user, events } = useUser();

  if (!user || !events) {
    return null;
  }

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
      events={events}
      title={title}
      description={description}
    />
  );
};

export default DonorSchedule;
