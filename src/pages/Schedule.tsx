import { useUser } from '@/hooks';

import ScheduleBase from '@/components/Schedule';

const DonorSchedule = () => {
  const { user, events } = useUser();

  if (!user || !events) {
    return null;
  }

  return user.role === 'donor' ? (
    <ScheduleBase
      events={events}
      title='Your Donation Schedule'
      description='View and manage your scheduled donations.'
    />
  ) : (
    <ScheduleBase
      events={events}
      title='Your Organization Events'
      description='View and manage your organization’s upcoming events.'
    />
  );
};

export default DonorSchedule;
