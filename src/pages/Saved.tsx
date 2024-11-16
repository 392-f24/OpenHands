import { Box, Typography } from '@mui/material';
import { useState } from 'react';

const Saved = ({ searchQuery }: { searchQuery: string }) => {
  const [savedOrgs, setSavedOrgs] = useState([]);

  return (
    <Box>
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
      >
        No saved organizations.
      </Typography>
    </Box>
  );
};

export default Saved;
