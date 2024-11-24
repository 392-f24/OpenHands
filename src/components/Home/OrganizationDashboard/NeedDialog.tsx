import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface NeedDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (need: Supply) => void;
  need: Supply | null;
}

const NeedDialog = ({ open, onClose, onSave, need }: NeedDialogProps) => {
  const [newNeed, setNewNeed] = useState<Supply>({
    itemName: '',
    quantityNeeded: 1, // Default value is 1
    quantityProvided: 0,
    providedBy: [],
    pickup: false,
    returnDate: undefined,
    status: false,
    loanable: false,
  });

  // Populate the dialog with existing need data when editing
  useEffect(() => {
    if (need) {
      setNewNeed(need);
    } else {
      // Reset to default for new need
      setNewNeed({
        itemName: '',
        quantityNeeded: 1,
        quantityProvided: 0,
        providedBy: [],
        pickup: false,
        returnDate: undefined,
        status: false,
        loanable: false,
      });
    }
  }, [need]);

  const handleSave = () => {
    if (newNeed.itemName.trim()) {
      onSave(newNeed);
    } else {
      alert('Need name cannot be empty.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{need ? 'Edit Need' : 'Add Need'}</DialogTitle>
      <DialogContent>
        <TextField
          label='Need Name'
          fullWidth
          margin='dense'
          value={newNeed.itemName}
          onChange={(e) =>
            setNewNeed((prev) => ({ ...prev, itemName: e.target.value }))
          }
        />
        <TextField
          label='Quantity Needed'
          type='number'
          fullWidth
          margin='dense'
          value={newNeed.quantityNeeded || ''}
          onChange={(e) => {
            const value = e.target.value; // Capture the raw input
            setNewNeed((prev) => ({
              ...prev,
              quantityNeeded:
                value === '' ? Number.NaN : Math.max(1, Number(value)),
            }));
          }}
          InputProps={{
            inputProps: { min: 1 }, // Set the minimum value
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={newNeed.loanable}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setNewNeed((prev) => ({
                  ...prev,
                  loanable: isChecked,
                  returnDate: isChecked ? prev.returnDate || '' : undefined,
                }));
              }}
            />
          }
          label='Loanable'
        />
        {newNeed.loanable && (
          <TextField
            label='Returnable After'
            type='date'
            fullWidth
            margin='dense'
            value={
              newNeed.returnDate
                ? new Date(newNeed.returnDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              setNewNeed((prev) => ({
                ...prev,
                returnDate: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined,
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={newNeed.pickup}
              onChange={(e) =>
                setNewNeed((prev) => ({ ...prev, pickup: e.target.checked }))
              }
            />
          }
          label='Pickup Available'
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color='secondary'
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color='primary'
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NeedDialog;
