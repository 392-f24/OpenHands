import { Box, Typography } from '@mui/material';
import { filter, lowerCase, some } from 'es-toolkit/compat';
import { useState } from 'react';

import OrganizationCard from './OrganizationCard';

import { useOrganizationStore } from '@/stores';

import { SearchBar, Filters } from '@/components/common';

const DonorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [needsQuery, setNeedsQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const organizationProfiles = useOrganizationStore(
    (state) => state.organizationProfiles
  );

  // Filtered organizations based on search query
  const filteredOrganizations = filter(organizationProfiles, (org) => {
    if (!org.name) return false;
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
