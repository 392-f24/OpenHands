import { Box } from '@mui/material';

import OrganizationCard from '@/components/Home/OrganizationCard';

const Home = ({ searchQuery }: { searchQuery: string }) => {
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

  // Filtered organizations based on search query
  const filteredOrganizations = organizations.filter((org) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      org.name.toLowerCase().includes(searchTerm) ||
      org.location.toLowerCase().includes(searchTerm) ||
      org.needs.some((need) => need.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <Box>
      {filteredOrganizations.map((org) => (
        <OrganizationCard
          organization={org}
          key={org.id}
        />
      ))}
    </Box>
  );
};

export default Home;
