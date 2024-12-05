import { useEffect } from 'react';

import { useUserStore, useEventStore } from '@/stores';

import ScheduleBase from '@/components/Schedule';

const DonorSchedule = () => {
  const user = useUserStore((state) => state.user);
  const eventIds = user?.joinedEvents || [];

  if (!user) return null;

  useEffect(() => {
    if (user) {
      useEventStore.getState().fetchEventsByIds(eventIds);
    }
  }, [user]); // Trigger fetch on user change

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
