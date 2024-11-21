import { Box, Typography } from '@mui/material';
import { filter, lowerCase, some } from 'es-toolkit/compat';
import { useState } from 'react';

import OrganizationCard from './OrganizationCard';

import { useUser } from '@/hooks';

import { SearchBar } from '@/components/common';

const DonorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { organizationProfiles } = useUser();

  // Filtered organizations based on search query
  const filteredOrganizations = filter(organizationProfiles, (org) => {
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
