import React, { useState } from 'react';
import { Box, Button, TextField, Popover, InputAdornment } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FiltersProps {
  needsQuery: string;
  setNeedsQuery: (query: string) => void;
  descriptionQuery: string;
  setDescriptionQuery: (query: string) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  needsQuery,
  setNeedsQuery,
  descriptionQuery,
  setDescriptionQuery,
  locationQuery,
  setLocationQuery,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filters-popover' : undefined;

  return (
    <Box>
      <Button
        variant='contained'
        onClick={handleOpen}
        startIcon={<FilterListIcon />}
        sx={{ marginTop: 2 }}
      >
        Filters
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '300px',
          }}
        >
          <TextField
            label='Filter by Needs'
            variant='outlined'
            value={needsQuery}
            onChange={(e) => setNeedsQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <FilterListIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label='Filter by Description'
            variant='outlined'
            value={descriptionQuery}
            onChange={(e) => setDescriptionQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <FilterListIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label='Filter by Location'
            variant='outlined'
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <FilterListIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default Filters;
