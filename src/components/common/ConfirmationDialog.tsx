import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'error';
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description = '', // If null, no description will be shown
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error', // 'primary' or 'error'
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby={
        description ? 'confirmation-dialog-description' : undefined
      }
      aria-hidden={!open}
      role='alertdialog'
    >
      <DialogTitle id='confirmation-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id='confirmation-dialog-description'>
            {description}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
