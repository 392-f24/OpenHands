import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import EditProfileDialog from './EditProfileDialog';

import { useUser } from '@/hooks';

interface ProfileCardProps {
  organization: OrganizationProfile;
}

const ProfileCard = ({ organization }: ProfileCardProps) => {
  const { updateProfile } = useUser();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(organization);

  const isMissingRequiredFields =
    !currentProfile.name.trim() || !currentProfile.description.trim();

  useEffect(() => {
    if (isMissingRequiredFields) {
      setOpenEditDialog(true);
    }
  }, [isMissingRequiredFields]);

  const saveProfile = async (updatedProfile: OrganizationProfile) => {
    try {
      await updateProfile({
        name: updatedProfile.name,
        description: updatedProfile.description,
        location: updatedProfile.location,
        website: updatedProfile.website,
      });
      setOpenEditDialog(false);
      setCurrentProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error_) {
      console.error('Error updating profile:', error_);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <>
      <Card
        sx={{
          mb: 3,
          padding: 2,
          boxShadow: 2,
          borderRadius: 2,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Typography
              variant='h5'
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Profile
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Name:</strong> {organization.name || 'N/A'}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Description:</strong> {organization.description || 'N/A'}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Location:</strong> {organization.location || 'N/A'}
            </Typography>
            <Typography>
              <strong>Website:</strong>{' '}
              {organization.website ? (
                <a
                  href={organization.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ color: 'inherit' }}
                >
                  {organization.website}
                </a>
              ) : (
                'N/A'
              )}
            </Typography>
          </div>
          <IconButton
            color='primary'
            onClick={() => setOpenEditDialog(true)}
          >
            <EditIcon />
          </IconButton>
        </CardContent>
      </Card>
      <EditProfileDialog
        open={openEditDialog}
        onClose={() => !isMissingRequiredFields && setOpenEditDialog(false)}
        onSave={saveProfile}
        initialProfile={currentProfile}
      />
    </>
  );
};

export default ProfileCard;
