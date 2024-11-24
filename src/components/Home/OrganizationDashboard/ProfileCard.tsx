import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

import { useUser } from '@/hooks';

interface ProfileCardProps {
  organization: OrganizationProfile;
}

const ProfileCard = ({ organization }: ProfileCardProps) => {
  const { updateProfile } = useUser();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(organization);

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
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant='h5'
            sx={{ fontWeight: 'medium', mb: 2 }}
          >
            Profile Information
          </Typography>
          <Typography>
            <strong>Name:</strong> {organization.name}
          </Typography>
          <Typography>
            <strong>Description:</strong> {organization.description}
          </Typography>
          <Typography>
            <strong>Location:</strong> {organization.location}
          </Typography>
          <Typography>
            <strong>Website:</strong>{' '}
            <a
              href={organization.website}
              target='_blank'
              rel='noopener noreferrer'
            >
              {organization.website}
            </a>
          </Typography>
          <IconButton
            color='primary'
            onClick={() => setIsEditingProfile(true)}
          >
            <EditIcon />
          </IconButton>
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
              setEditedProfile((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            label='Description'
            fullWidth
            margin='dense'
            value={editedProfile.description}
            onChange={(e) =>
              setEditedProfile((prev) => ({
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
              setEditedProfile((prev) => ({
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
              setEditedProfile((prev) => ({
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
    </>
  );
};

export default ProfileCard;
