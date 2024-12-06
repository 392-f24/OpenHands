import { Box, Typography } from '@mui/material';
import { filter, lowerCase, some } from 'es-toolkit/compat';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import OrganizationCard from './OrganizationCard';

import { useOrganizationStore } from '@/stores';

import { SearchBar, LoadingCircle, Filters } from '@/components/common';

const DonorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [needsQuery, setNeedsQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
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

  //filtering organizations based on needs and description
  const filteredByNeedsAndDescription = filter(filteredOrganizations, (org) => {
    const matchesNeeds = needsQuery
      ? some(org.needs, (need) =>
          lowerCase(need.itemName || '').includes(lowerCase(needsQuery))
        )
      : true;

    const matchesDescription = descriptionQuery
      ? lowerCase(org.description || '').includes(lowerCase(descriptionQuery))
      : true;

    const matchesLocation = locationQuery
      ? lowerCase(org.location || '').includes(lowerCase(locationQuery))
      : true;

    return matchesNeeds && matchesDescription && matchesLocation;
  });

  return organizationProfiles.length > 0 ? (
    <div>
      <Box
        display='flex'
        gap={2}
        alignItems='center'
        mb={3}
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Filters
          needsQuery={needsQuery}
          setNeedsQuery={setNeedsQuery}
          descriptionQuery={descriptionQuery}
          setDescriptionQuery={setDescriptionQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {filteredByNeedsAndDescription.map((org) => (
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
