import { useUserStore, useEventStore } from '@/stores';

import ScheduleBase from '@/components/Schedule';

const DonorSchedule = () => {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const events = useEventStore((store) => store.events);

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
