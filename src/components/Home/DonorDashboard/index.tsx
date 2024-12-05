import { Box, Typography } from '@mui/material';
import { filter, lowerCase, some } from 'es-toolkit/compat';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import OrganizationCard from './OrganizationCard';

import { useOrganizationStore } from '@/stores';

import { SearchBar, LoadingCircle } from '@/components/common';

const DonorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    organizationProfiles,
    fetchProfiles,
    subscribeToProfiles,
    loading,
    error,
  } = useOrganizationStore();

  useEffect(() => {
    fetchProfiles();
    const unsubscribe = subscribeToProfiles;

    return () => unsubscribe && unsubscribe();
  }, [fetchProfiles, subscribeToProfiles]);

  if (loading) return <LoadingCircle />;
  if (error) {
    toast.error(error);
    return <p>{error}</p>;
  }

  // Filtered organizations based on search query
  const filteredOrganizations = filter(organizationProfiles, (org) => {
    if (org.name === '' || !org.name) return false;
    const searchTerm = lowerCase(searchQuery);
    return (
      lowerCase(org.name).includes(searchTerm) ||
      lowerCase(org.location).includes(searchTerm) ||
      some(org.needs, (need) => lowerCase(need).includes(searchTerm))
    );
  });

  return organizationProfiles.length > 0 ? (
    <div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {filteredOrganizations.map((org) => (
          <OrganizationCard
            organization={org}
            key={org.uid}
          />
        ))}
      </Box>
    </div>
  ) : (
    <Typography
      variant='body1'
      color='text.secondary'
      m={5}
    >
      No organizations.
    </Typography>
  );
};

export default DonorDashboard;
