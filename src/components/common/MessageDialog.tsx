import React from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  onClose,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color='secondary'
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
