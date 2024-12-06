import { Typography } from '@mui/material';
import { useEffect, type ReactElement } from 'react';
import { toast } from 'sonner';

import { useOrganizationStore, useUserStore } from '@/stores';

import LoadingCircle from '@/components/common/LoadingCircle';

type ProtectedRouteProps = {
  element: ReactElement;
};

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);

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

  if (user.role !== 'organization') {
    const orgLoading = useOrganizationStore((state) => state.loading);
    const subscribeToProfiles = useOrganizationStore(
      (state) => state.subscribeToProfiles
    );
    const error = useOrganizationStore((state) => state.error);

    useEffect(() => {
      const unsubscribe = subscribeToProfiles;

      return () => unsubscribe && unsubscribe();
    }, [subscribeToProfiles]);

    if (orgLoading) return <LoadingCircle />;

    if (error) {
      toast.error(error);
      return (
        <Typography
          variant='body1'
          color='error'
          align='center'
          sx={{ mt: 4 }}
        >
          {error}
        </Typography>
      );
    }
  }

  return element;
};

export default ProtectedRoute;
