import { Box, Typography } from '@mui/material';

import SavedOrganizationCard from '@/components/Home/SavedCard';

import useSaved from '@/hooks/useSaved';

const Saved = () => {
  const { savedOrgs, toggleSavedOrg } = useSaved();

  return (
    <Box>
      <h1 style={{ marginLeft: '20px' }}>Saved Organizations</h1>
      {savedOrgs.length > 0 ? (
        savedOrgs.map((org) => (
          <SavedOrganizationCard
            key={org.id}
            organization={org}
            onRemove={() => toggleSavedOrg(org)}
          />
        ))
      ) : (
        <Typography
          variant='body1'
          color='text.secondary'
          m={5}
        >
          No currently saved organizations. Save an organization on the home
          page.
        </Typography>
      )}
    </Box>
  );
};

export default Saved;
