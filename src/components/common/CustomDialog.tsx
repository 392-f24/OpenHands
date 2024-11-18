import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import React from 'react';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actions?: DialogAction[]; // Array of actions for buttons
  children?: React.ReactNode; // Custom content
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  title,
  description,
  actions = [],
  children,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='custom-dialog-title'
      aria-describedby='custom-dialog-description'
    >
      <DialogTitle id='custom-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id='custom-dialog-description'>
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            color={action.color || 'primary'}
          >
            {action.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
