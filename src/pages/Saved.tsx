import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from '@mui/material';
import { filter, lowerCase } from 'es-toolkit/compat';
import { useState } from 'react';

const Saved = ({ searchQuery }: { searchQuery: string }) => {
  const [savedOrgs, setSavedOrgs] = useState([
    {
      id: 1,
      name: 'Animal Shelter',
      location: 'North Side',
      description: 'Caring for animals in need.',
    },
    {
      id: 2,
      name: 'Community Library',
      location: 'East Side',
      description: 'Providing free access to books.',
    },
  ]);

  const addOrganization = () => {
    const newOrg = {
      id: savedOrgs.length + 1,
      name: 'New Organization',
      location: 'Unknown',
      description: 'A new organization to be added.',
    };
    setSavedOrgs((prev) => [...prev, newOrg]);
  };

  const removeOrganization = (id: number) => {
    setSavedOrgs(filter(savedOrgs, (org) => org.id !== id));
  };

  // Filter saved organizations based on search query
  const filteredSavedOrgs = filter(savedOrgs, (org) => {
    const searchTerm = lowerCase(searchQuery);
    return (
      lowerCase(org.name).includes(searchTerm) ||
      lowerCase(org.location).includes(searchTerm) ||
      lowerCase(org.description).includes(searchTerm)
    );
  });

  return (
    <Box>
      <Stack
        direction='row'
        justifyContent='center'
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={addOrganization}
        >
          Add Organization
        </Button>
      </Stack>
      {filteredSavedOrgs.length > 0 ? (
        <List>
          {filteredSavedOrgs.map((org) => (
            <ListItem
              key={org.id}
              secondaryAction={
                <Button
                  variant='text'
                  color='error'
                  onClick={() => removeOrganization(org.id)}
                >
                  Remove
                </Button>
              }
            >
              <ListItemText
                primary={org.name}
                secondary={`${org.location} - ${org.description}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography
          variant='body2'
          color='text.secondary'
          align='center'
        >
          No saved organizations match your search.
        </Typography>
      )}
    </Box>
  );
};

export default Saved;
