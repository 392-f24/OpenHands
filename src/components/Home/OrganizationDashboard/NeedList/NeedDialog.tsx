import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface NeedDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (need: Supply) => Promise<void>;
  need: Supply | null;
}

const DEFAULT_NEED: Supply = {
  itemName: '',
  quantityNeeded: 1,
  quantityProvided: 0,
  providedBy: [],
  pickup: false,
  returnDate: undefined,
  status: false,
  loanable: false,
};

const NeedDialog = ({ open, onClose, onSave, need }: NeedDialogProps) => {
  const [newNeed, setNewNeed] = useState<Supply>(DEFAULT_NEED);

  useEffect(() => {
    setNewNeed(need || DEFAULT_NEED);
  }, [need]);

  const updateNeed = useCallback(
    (field: Partial<Supply>) => {
      setNewNeed((previous) => ({ ...previous, ...field }));
    },
    [setNewNeed]
  );

  const handleSave = useCallback(async () => {
    if (!newNeed.itemName.trim()) {
      toast.warning('Need name cannot be empty.');
      return;
    }
    await onSave(newNeed);
  }, [newNeed, onSave]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{need ? 'Edit Need' : 'Add Need'}</DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <TextField
          label='Need Name'
          fullWidth
          margin='dense'
          value={newNeed.itemName}
          onChange={(event_) => updateNeed({ itemName: event_.target.value })}
        />
        <TextField
          label='Quantity Needed'
          type='number'
          fullWidth
          margin='dense'
          value={newNeed.quantityNeeded || ''}
          onChange={(event_) =>
            updateNeed({
              quantityNeeded: Math.max(1, Number(event_.target.value) || 1),
            })
          }
          slotProps={{
            htmlInput: {
              min: 1,
            },
          }}
        />
        <Box mt={2}>
          <FormControlLabel
            control={
              <Switch
                checked={newNeed.loanable}
                onChange={(event_) =>
                  updateNeed({
                    loanable: event_.target.checked,
                    returnDate: event_.target.checked
                      ? newNeed.returnDate || ''
                      : undefined,
                  })
                }
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
              onChange={(event_) =>
                updateNeed({
                  returnDate: event_.target.value
                    ? new Date(event_.target.value).toISOString()
                    : undefined,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          )}
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={
              <Switch
                checked={newNeed.pickup}
                onChange={(event_) =>
                  updateNeed({ pickup: event_.target.checked })
                }
              />
            }
            label='Pickup Available'
          />
        </Box>
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
          disabled={
            !newNeed.itemName.trim() ||
            (newNeed.loanable && !newNeed.returnDate) ||
            newNeed.quantityNeeded < 1
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NeedDialog;
