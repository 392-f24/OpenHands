import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

type UserType = 'donor' | 'organization';

const RoleSelectionModal: React.FC<{
  onSelectRole: (role: UserType) => void;
  open: boolean;
  onClose: () => void;
}> = ({ onSelectRole, open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
  >
    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
      Select Your Role
    </DialogTitle>
    <Typography
      variant='body1'
      align='center'
      sx={{ padding: '16px' }}
    >
      Are you a donor looking to contribute or an organization seeking help?
    </Typography>
    <DialogActions sx={{ justifyContent: 'space-around', padding: '16px' }}>
      <Button
        variant='contained'
        onClick={() => onSelectRole('donor')}
        color='primary'
      >
        Donor
      </Button>
      <Button
        variant='contained'
        onClick={() => onSelectRole('organization')}
        color='secondary'
      >
        Organization
      </Button>
    </DialogActions>
  </Dialog>
);

export default RoleSelectionModal;
