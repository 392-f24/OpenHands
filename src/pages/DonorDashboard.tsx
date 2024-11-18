import { Box } from '@mui/material';
import { filter, lowerCase, some } from 'es-toolkit/compat';
import { useState } from 'react';

import { SearchBar } from '@/components/common';
import OrganizationCard from '@/components/Home/OrganizationCard';

const DonorDashboard = () => {
  const organizations = [
    {
      id: 1,
      name: 'Community Food Pantry',
      location: 'City Center',
      description: 'Providing food for those in need.',
      website: 'https://example.com',
      needs: ['Bread', 'Canned Soup', 'Boxed Pasta', 'Fresh Vegetables'],
      loanable: false,
    },
    {
      id: 2,
      name: 'Youth Theater Company',
      location: 'Downtown',
      description: 'Supporting young artists.',
      website: 'https://example.com',
      needs: ['Costumes', 'Props'],
      loanable: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  // Filtered organizations based on search query
  const filteredOrganizations = filter(organizations, (org) => {
    const searchTerm = lowerCase(searchQuery);
    return (
      lowerCase(org.name).includes(searchTerm) ||
      lowerCase(org.location).includes(searchTerm) ||
      some(org.needs, (need) => lowerCase(need).includes(searchTerm))
    );
  });

  return (
    <div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {filteredOrganizations.map((org) => (
          <OrganizationCard
            organization={org}
            key={org.id}
          />
        ))}
      </Box>
    </div>
  );
};

export default DonorDashboard;