import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type dayjs from 'dayjs';

import { useEvents } from '@/hooks';

import { MessageDialog } from '@/components/common';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  organization: OrganizationProfile;
  selectedNeeds: string[];
  donor: DonorProfile;
}

const DonationModal = ({
  open,
  onClose,
  organization,
  selectedNeeds,
  donor,
}: DonationModalProps) => {
  const [method, setMethod] = useState<string>('drop-off');
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [message, setMessage] = useState<string>('');
  const { addOrUpdateEvent } = useEvents();

  const handleConfirm = () => {
    if (selectedNeeds.length === 0 || !selectedTime || !method) {
      setMessage('Please fill out all fields and select at least one need.');
      setOpenMessageDialog(true);
      return;
    }

    const newEvent: DonationEvent = {
      eventId: `${organization.uid}-${new Date().toISOString()}`, // unique ID
      title: `Donation to ${organization.name}`,
      description: `Donation of items: ${selectedNeeds.join(', ')}`,
      date: selectedTime.toDate(),
      supplies: selectedNeeds.map(
        (item) =>
          ({
            itemName: item,
            quantityNeeded: 1, // Default assumption
            quantityProvided: 1, // Donor provides these items
            providedBy: [donor.uid],
            status: true,
          }) as Supply
      ),
    };

    addOrUpdateEvent(newEvent, selectedNeeds);

    setMessage('Donation successfully added to your schedule!');
    setOpenMessageDialog(true);

    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disableEnforceFocus
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 5,
        }}
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
            borderRadius: 3,
            width: '90%',
            maxWidth: 500,
          }}
        >
          <Typography
            variant='h6'
            fontWeight='bold'
            mb={3}
            textAlign='center'
          >
            Schedule Your Donation
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              mb={1}
            >
              Select a Delivery Method:
            </Typography>
            <RadioGroup
              value={method}
              onChange={(e) => setMethod(e.target.value)}
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
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              mb={1}
            >
              Select a Time:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={selectedTime}
                onChange={setSelectedTime}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        fontSize: '1rem',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={onClose}
              color='secondary'
              size='large'
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant='contained'
              size='large'
              sx={{ px: 3 }}
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
