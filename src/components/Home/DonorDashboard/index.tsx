import { Box, Typography } from '@mui/material';
import { useState, useMemo } from 'react';

import OrganizationCard from './OrganizationCard';

import { useOrganizationStore, useUserStore } from '@/stores';

import { SearchBar, Filters, LoadingCircle } from '@/components/common';

const DonorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [needsQuery, setNeedsQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const loading = useUserStore((state) => state.loading);
  if (loading) return <LoadingCircle />;

  const organizationProfiles = useOrganizationStore(
    (state) => state.organizationProfiles
  );

  const filteredOrganizations = useMemo(() => {
    return organizationProfiles.filter((org) => {
      const matchesSearch = searchQuery
        ? org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (org.needs || []).some((need) =>
            need.itemName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      const matchesNeeds = needsQuery
        ? (org.needs || []).some((need) =>
            need.itemName.toLowerCase().includes(needsQuery.toLowerCase())
          )
        : true;

      const matchesDescription = descriptionQuery
        ? org.description
            ?.toLowerCase()
            .includes(descriptionQuery.toLowerCase())
        : true;

      const matchesLocation = locationQuery
        ? org.location.toLowerCase().includes(locationQuery.toLowerCase())
        : true;

      return (
        matchesSearch && matchesNeeds && matchesDescription && matchesLocation
      );
    });
  }, [
    organizationProfiles,
    searchQuery,
    needsQuery,
    descriptionQuery,
    locationQuery,
  ]);

  return organizationProfiles.length > 0 ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SearchBar onSearchChange={setSearchQuery} />
        <Filters
          needsQuery={needsQuery}
          setNeedsQuery={setNeedsQuery}
          descriptionQuery={descriptionQuery}
          setDescriptionQuery={setDescriptionQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
        />
      </Box>

      {filteredOrganizations.map((org) => (
        <OrganizationCard
          organization={org}
          key={org.uid}
        />
      ))}
    </Box>
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
