import { Typography } from '@mui/material';
import { type ReactElement } from 'react';

import { useUserStore, useOrganizationStore } from '@/stores';

import LoadingCircle from '@/components/common/LoadingCircle';

type ProtectedRouteProps = {
  element: ReactElement;
};

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const orgLoading = useOrganizationStore((state) => state.loading);

  if (loading || (user && user.role !== 'organization' && orgLoading)) {
    return <LoadingCircle />;
  }

  if (!user) {
    return (
      <Typography
        variant='h6'
        sx={{
          textAlign: 'center',
          marginTop: '2rem',
        }}
      >
        Please sign in to view this page
      </Typography>
    );
  }

  return element;
};

export default ProtectedRoute;
