import { Box, Typography } from '@mui/material';

import SavedOrganizationCard from '@/components/Home/SavedCard';

import useSaved from '@/hooks/useSaved';

const Saved = () => {
  const { savedOrgs, toggleSavedOrg } = useSaved();

  return (
    <Box>
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
          variant='body2'
          color='text.secondary'
          align='center'
        >
          No saved organizations.
        </Typography>
      )}
    </Box>
  );
};

export default Saved;
