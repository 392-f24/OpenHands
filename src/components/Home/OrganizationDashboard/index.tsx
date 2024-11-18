import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

const OrganizationDashboard = () => {
  const [organization] = useState({
    name: 'Community Food Pantry',
    description: 'Providing food for those in need.',
    location: 'City Center',
    website: 'https://example.com',
  });

  const [needs, setNeeds] = useState([
    'Bread',
    'Canned Soup',
    'Boxed Pasta',
    'Fresh Vegetables',
  ]);
  const [newNeed, setNewNeed] = useState('');
  const [isAddingNeed, setIsAddingNeed] = useState(false);

  const handleAddNeed = () => {
    if (newNeed.trim()) {
      setNeeds([...needs, newNeed.trim()]);
      setNewNeed('');
      setIsAddingNeed(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant='h4'
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        Organization&apos;s Profile
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='h5'
              sx={{ fontWeight: 'medium' }}
            >
              Profile Information
            </Typography>
            <Button
              variant='outlined'
              color='primary'
              startIcon={<EditIcon />}
              onClick={() => console.log('Edit profile button clicked!')}
            >
              Edit Profile
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant='body1'
              sx={{ mb: 1 }}
            >
              <strong>Name:</strong> {organization.name}
            </Typography>
            <Typography
              variant='body1'
              sx={{ mb: 1 }}
            >
              <strong>Description:</strong> {organization.description}
            </Typography>
            <Typography
              variant='body1'
              sx={{ mb: 1 }}
            >
              <strong>Location:</strong> {organization.location}
            </Typography>
            <Typography
              variant='body1'
              sx={{ mb: 1 }}
            >
              <strong>Website:</strong>{' '}
              <a
                href={organization.website}
                target='_blank'
                rel='noopener noreferrer'
              >
                {organization.website}
              </a>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant='h5'
            sx={{ fontWeight: 'medium', mb: 2 }}
          >
            Current Needs
          </Typography>

          <List>
            {needs.map((need, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: 'primary.light',
                  marginBottom: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <ListItemText
                  primary={need}
                  sx={{ color: 'text.primary', fontWeight: 'medium' }}
                />
              </ListItem>
            ))}
          </List>

          {isAddingNeed ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                value={newNeed}
                onChange={(e) => setNewNeed(e.target.value)}
                placeholder='Enter new need'
                size='small'
                sx={{ flex: 1, marginRight: 1 }}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={handleAddNeed}
                sx={{ minWidth: 100 }}
              >
                Add
              </Button>
            </Box>
          ) : (
            <Button
              startIcon={<AddIcon />}
              variant='contained'
              color='secondary'
              onClick={() => setIsAddingNeed(true)}
              sx={{ mt: 2 }}
            >
              Add Needs
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrganizationDashboard;
