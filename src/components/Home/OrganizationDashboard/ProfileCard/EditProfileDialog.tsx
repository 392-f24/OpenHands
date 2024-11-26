import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedProfile: OrganizationProfile) => Promise<void>;
  initialProfile: OrganizationProfile;
}

const EditProfileDialog = ({
  open,
  onClose,
  onSave,
  initialProfile,
}: EditProfileDialogProps) => {
  const [editedProfile, setEditedProfile] = useState(initialProfile);
  const isMissingRequiredFields =
    !editedProfile.name.trim() || !editedProfile.description.trim();

  useEffect(() => {
    if (open) {
      setEditedProfile(initialProfile);
    }
  }, [open, initialProfile]);

  const handleSave = async () => {
    if (isMissingRequiredFields) return;
    await onSave(editedProfile);
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isMissingRequiredFields && onClose()}
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField
          label='Name'
          fullWidth
          margin='dense'
          value={editedProfile.name}
          onChange={(event_) =>
            setEditedProfile((previous) => ({
              ...previous,
              name: event_.target.value,
            }))
          }
          error={!editedProfile.name.trim()}
          helperText={editedProfile.name.trim() ? '' : 'Name is required'}
        />
        <TextField
          label='Description'
          fullWidth
          margin='dense'
          value={editedProfile.description}
          onChange={(event_) =>
            setEditedProfile((previous) => ({
              ...previous,
              description: event_.target.value,
            }))
          }
          error={!editedProfile.description.trim()}
          helperText={
            editedProfile.description.trim() ? '' : 'Description is required'
          }
        />
        <TextField
          label='Location'
          fullWidth
          margin='dense'
          value={editedProfile.location}
          onChange={(event_) =>
            setEditedProfile((previous) => ({
              ...previous,
              location: event_.target.value,
            }))
          }
        />
        <TextField
          label='Website'
          fullWidth
          margin='dense'
          value={editedProfile.website}
          onChange={(event_) =>
            setEditedProfile((previous) => ({
              ...previous,
              website: event_.target.value,
            }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color='secondary'
          disabled={isMissingRequiredFields}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color='primary'
          disabled={isMissingRequiredFields}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
