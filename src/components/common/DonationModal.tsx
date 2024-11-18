import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';

import { useEvents } from '@/hooks';

import { MessageDialog } from '@/components/common';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  organization: {
    name: string;
    location: string;
    pickup: boolean;
  };
  selectedNeeds: string[];
}

const DonationModal: React.FC<DonationModalProps> = ({
  open,
  onClose,
  organization,
  selectedNeeds,
}) => {
  const [method, setMethod] = useState<string>('drop-off');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [message, setMessage] = useState<string>('');
  const { addEvent } = useEvents();

  const handleConfirm = () => {
    if (selectedNeeds.length === 0 || !selectedTime || !method) {
      setMessage('Please fill out all fields and select at least one need');
      setOpenMessageDialog(true);
      return;
    }

    addEvent({
      organizationName: organization.name,
      organizationLocation: organization.location,
      items: selectedNeeds,
      time: selectedTime,
      method,
    });

    setMessage('Donation successfully added to your schedule!');
    setOpenMessageDialog(true);

    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '90%',
            maxWidth: 400,
          }}
        >
          <Typography
            variant='h6'
            mb={2}
          >
            Schedule Your Donation
          </Typography>
          <RadioGroup
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value='drop-off'
              control={<Radio />}
              label='Drop-off'
            />
            {organization.pickup && (
              <FormControlLabel
                value='pick-up'
                control={<Radio />}
                label='Pick-up'
              />
            )}
          </RadioGroup>
          <Typography
            variant='body2'
            mb={1}
          >
            Select a time:
          </Typography>
          <TextField
            type='datetime-local'
            fullWidth
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={onClose}
              color='secondary'
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant='contained'
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <MessageDialog
        open={openMessageDialog}
        onClose={() => setOpenMessageDialog(false)}
        message={message}
      />
    </>
  );
};

export default DonationModal;
