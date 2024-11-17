import { Typography } from '@mui/material';
import type { ReactElement } from 'react';

import LoadingCircle from '@/components/common/LoadingCircle';

import useUser from '@/hooks/useUser';

type ProtectedRouteProps = {
  element: ReactElement;
};

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { user, loading } = useUser();

  if (loading) return <LoadingCircle />;
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
