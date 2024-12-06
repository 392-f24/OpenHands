import { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useOrganizationStore } from '@/stores';

interface FiltersProps {
  needsQuery: string;
  setNeedsQuery: (query: string) => void;
  descriptionQuery: string;
  setDescriptionQuery: (query: string) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
}

const Filters = ({
  needsQuery,
  setNeedsQuery,
  descriptionQuery,
  setDescriptionQuery,
  locationQuery,
  setLocationQuery,
}: FiltersProps) => {
  const organizationProfiles = useOrganizationStore(
    (state) => state.organizationProfiles
  );

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorElement(null);
  };

  const open = Boolean(anchorElement);
  const id = open ? 'filters-popover' : undefined;

  const needsOptions = [
    ...new Set(
      organizationProfiles.flatMap(
        (org) => org.needs?.flatMap((need) => need.itemName) || []
      )
    ),
  ].filter(Boolean);

  return (
    <Box>
      <Button
        variant='contained'
        onClick={(event_) => setAnchorElement(event_.currentTarget)}
        startIcon={<FilterListIcon />}
        sx={{ marginTop: 2 }}
      >
        Filters
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorElement}
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
          {/* Needs dropdown */}
          <FormControl fullWidth>
            <InputLabel id='needs-filter-label'>Filter by Needs</InputLabel>
            <Select
              labelId='needs-filter-label'
              value={needsQuery}
              onChange={(event_) => setNeedsQuery(event_.target.value)}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 'calc(80vh - 96px)',
                    overflowY: 'auto',
                  },
                },
                disablePortal: false,
              }}
            >
              <MenuItem value=''>All</MenuItem>
              {needsOptions.map((need, index) => (
                <MenuItem
                  key={index}
                  value={String(need)}
                >
                  {String(need)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description text field */}
          <TextField
            label='Filter by Description'
            variant='outlined'
            fullWidth
            value={descriptionQuery}
            onChange={(event_) => setDescriptionQuery(event_.target.value)}
          />

          {/* Location text field */}
          <TextField
            label='Filter by Location'
            variant='outlined'
            fullWidth
            value={locationQuery}
            onChange={(event_) => setLocationQuery(event_.target.value)}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default Filters;
