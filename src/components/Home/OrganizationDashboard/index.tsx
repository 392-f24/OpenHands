import { Box, Typography } from '@mui/material';

import OrgNeedsList from './NeedList';
import ProfileCard from './ProfileCard';

import useUser from '@/hooks/useUser';

const OrganizationDashboard = () => {
  const { user } = useUser();

  if (!user || user.role !== 'organization') {
    return (
      <Typography
        variant='h5'
        textAlign='center'
      >
        You are not authorized to view this page.
      </Typography>
    );
  }

  const organization = user as OrganizationProfile;

  return (
    <Box sx={{ padding: 3 }}>
      <ProfileCard organization={organization} />
      <OrgNeedsList organization={organization} />
    </Box>
  );
};

export default OrganizationDashboard;
