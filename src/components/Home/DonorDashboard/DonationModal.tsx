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

import { MessageDialog } from '@/components/common';

import useEvents from '@/hooks/useEvents';

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
  const { addDonationEvent } = useEvents();

  const [method, setMethod] = useState<string>('drop-off');
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [providedQuantities, setProvidedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleQuantityChange = (needName: string, quantity: number) => {
    setProvidedQuantities((prev) => ({
      ...prev,
      [needName]: quantity,
    }));
  };

  // Check if any selected need has pickup enabled
  const isPickupAvailable = selectedNeeds.some((needName) => {
    const need = organization.needs.find((n) => n.itemName === needName);
    return need?.pickup; // Check if the need has pickup enabled
  });

  const handleConfirm = async () => {
    if (!selectedTime || !method || selectedNeeds.length === 0) {
      setMessage('Please fill out all fields and select at least one need.');
      setOpenMessageDialog(true);
      return;
    }

    const formattedDate = selectedTime.format('YYYY-MM-DDTHH:mm:ss');

    // Update the organization's needs
    const updatedNeeds = organization.needs.map((need) => {
      if (selectedNeeds.includes(need.itemName)) {
        const quantityProvided = providedQuantities[need.itemName] || 0;
        const remainingQuantity = need.quantityNeeded - quantityProvided;

        return {
          ...need,
          quantityNeeded: Math.max(0, remainingQuantity), // Ensure non-negative value
          quantityProvided: need.quantityProvided + quantityProvided,
          providedBy: need.providedBy.includes(donor.uid)
            ? need.providedBy
            : [...need.providedBy, donor.uid],
          status: remainingQuantity === 0, // Mark as fulfilled if quantityNeeded is 0
        };
      }
      return need;
    });

    // Create a new donation event
    const newEvent: DonationEvent = {
      eventId: `${organization.uid}-${donor.uid}-${new Date().toISOString()}`,
      organizationId: organization.uid,
      donorId: donor.uid,
      title: `To ${organization.name} from ${donor.name}`,
      description: `Donation of items: ${selectedNeeds.join(', ')}`,
      date: formattedDate,
      supplies: selectedNeeds.map((itemName) => {
        const supply = organization.needs.find((n) => n.itemName === itemName);
        return {
          itemName,
          quantityNeeded: supply?.quantityNeeded || 1,
          quantityProvided: providedQuantities[itemName] || 1,
          providedBy: [donor.uid],
          status: (supply?.quantityNeeded ?? 0) > 0,
          pickup: method === 'pick-up',
          loanable: supply?.loanable || false,
          returnDate: supply?.loanable ? supply.returnDate || '' : '',
        };
      }),
    };

    // Prepare updates for the organization profile
    const organizationUpdates = {
      uid: organization.uid,
      needs: updatedNeeds, // Update needs array
      joinedEvents: [...organization.joinedEvents, newEvent.eventId], // Append new event to joinedEvents
    };

    // Prepare updates for the donor profile
    const donorUpdates = {
      uid: donor.uid,
      joinedEvents: [...donor.joinedEvents, newEvent.eventId], // Append new event to joinedEvents
      providedSupplies: [
        ...donor.providedSupplies,
        ...newEvent.supplies.map((supply) => ({
          eventId: newEvent.eventId,
          itemName: supply.itemName,
          quantityProvided: supply.quantityProvided,
          organizationId: organization.uid,
        })),
      ],
    };

    try {
      // Pass all updates to the `addDonationEvent` function
      await addDonationEvent(newEvent, donorUpdates, organizationUpdates);

      setMessage('Donation successfully added to your schedule!');
      setOpenMessageDialog(true);
      onClose();
    } catch (error) {
      console.error('Error scheduling donation:', error);
      setMessage('Failed to schedule donation. Please try again.');
      setOpenMessageDialog(true);
    }
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
              Provide Quantities for Selected Needs:
            </Typography>
            {selectedNeeds.map((needName) => {
              const need = organization.needs.find(
                (n) => n.itemName === needName
              );
              return (
                <Box
                  key={needName}
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant='body2'
                    mb={1}
                  >
                    {need?.itemName} (Remaining: {need?.quantityNeeded})
                  </Typography>
                  <input
                    type='number'
                    min='1'
                    max={need?.quantityNeeded || 1}
                    value={providedQuantities[needName] || ''}
                    onChange={(e) =>
                      handleQuantityChange(needName, Number(e.target.value))
                    }
                    placeholder='Enter quantity to provide'
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '1rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Box>
              );
            })}
          </Box>
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
              {isPickupAvailable && (
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
