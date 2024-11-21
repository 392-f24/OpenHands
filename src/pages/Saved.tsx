import { Box, Typography } from '@mui/material';

import { useSavedOrgs } from '@/hooks';

import SavedOrganizationCard from '@/components/Home/SavedCard';

const Saved = () => {
  const { savedOrgs, updateSavedOrgs } = useSavedOrgs();

  return (
    <Box>
      <h1 style={{ marginLeft: '20px' }}>Saved Organizations</h1>
      {savedOrgs.length > 0 ? (
        savedOrgs.map((org) => (
          <SavedOrganizationCard
            key={org.uid}
            organization={org}
            onRemove={() => updateSavedOrgs(org)}
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
