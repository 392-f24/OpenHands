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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { useUser } from '@/hooks';

const Dashboard = () => {
  const { user, updateProfile } = useUser();

  if (!user || user.role !== 'organization') {
    return (
      <Typography
        variant='h5'
        textAlign='center'
      >
        You are not authorized to view this page.
      </Typography>
    );
  }
  const organization = user as OrganizationProfile;

  const [newNeed, setNewNeed] = useState('');
  const [isAddingNeed, setIsAddingNeed] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(organization);

  const { needs } = organization;

  const handleAddNeed = async () => {
    if (newNeed.trim()) {
      const updatedNeeds = [...needs, newNeed.trim()];
      setNewNeed('');
      setIsAddingNeed(false);

      try {
        await updateProfile({ needs: updatedNeeds });
        console.info('Needs updated successfully');
      } catch (error) {
        console.error('Error updating needs:', error);
        alert('Failed to update needs. Please try again.');
      }
    }
  };

  const saveProfile = async () => {
    try {
      await updateProfile({
        name: editedProfile.name,
        description: editedProfile.description,
        location: editedProfile.location,
        website: editedProfile.website,
      });
      setIsEditingProfile(false);
      console.info('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
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

      {/* Profile Information */}
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
              onClick={() => setIsEditingProfile(true)}
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

      {/* Current Needs */}
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
              color='success'
              onClick={() => setIsAddingNeed(true)}
              sx={{ mt: 2 }}
            >
              Add Needs
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Profile Editing Dialog */}
      <Dialog
        open={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label='Name'
            fullWidth
            margin='dense'
            value={editedProfile.name}
            onChange={(e) =>
              setEditedProfile((prev: OrganizationProfile) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <TextField
            label='Description'
            fullWidth
            margin='dense'
            value={editedProfile.description}
            onChange={(e) =>
              setEditedProfile((prev: OrganizationProfile) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <TextField
            label='Location'
            fullWidth
            margin='dense'
            value={editedProfile.location}
            onChange={(e) =>
              setEditedProfile((prev: OrganizationProfile) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />
          <TextField
            label='Website'
            fullWidth
            margin='dense'
            value={editedProfile.website}
            onChange={(e) =>
              setEditedProfile((prev: OrganizationProfile) => ({
                ...prev,
                website: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsEditingProfile(false)}
            color='secondary'
          >
            Cancel
          </Button>
          <Button
            onClick={saveProfile}
            color='primary'
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
