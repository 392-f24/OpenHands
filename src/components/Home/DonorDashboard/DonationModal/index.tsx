import { useState } from 'react';
import { Modal, Box, Typography, Divider, Button } from '@mui/material';
import { toast } from 'sonner';
import type dayjs from 'dayjs';

import QuantityInput from './QuantityInput';
import DeliveryMethodSelector from './DeliveryMethodSelector';
import TimeSelector from './TimeSelector';
import { DeliveryMethod } from './types';

import { useEventStore } from '@/stores';

import prepareDonationData from '@/utils/eventsUtils';

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
  const addDonationEvent = useEventStore((state) => state.addDonationEvent);
  const [method, setMethod] = useState<DeliveryMethod>(DeliveryMethod.DROP_OFF);
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [providedQuantities, setProvidedQuantities] = useState<{
    [key: string]: number;
  }>({});

  const handleConfirm = async () => {
    if (!selectedTime || !method || selectedNeeds.length === 0) {
      toast.warning('Please fill out all fields and select at least one need.');
      return;
    }

    const formattedDate = selectedTime.format('YYYY-MM-DDTHH:mm:ss');
    const data = prepareDonationData(
      organization,
      donor,
      selectedNeeds,
      providedQuantities,
      formattedDate,
      method
    );

    if (!data) {
      toast.warning('Unable to prepare donation data. Please try again.');
      return;
    }
    const { newEvent, donorUpdates, organizationUpdates } = data;

    try {
      await addDonationEvent(newEvent, donorUpdates, organizationUpdates);
      toast.success('Donation successfully added to your schedule!');
      onClose();
    } catch (error) {
      console.error('Error scheduling donation:', error);
      toast.error('Failed to schedule donation. Please try again.');
    }
  };

  return (
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
        <QuantityInput
          organization={organization}
          selectedNeeds={selectedNeeds}
          providedQuantities={providedQuantities}
          onChange={setProvidedQuantities}
        />
        <DeliveryMethodSelector
          method={method}
          isPickupAvailable={selectedNeeds?.some(
            (needName) =>
              organization.needs?.find((name_) => name_.itemName === needName)
                ?.pickup
          )}
          onChange={setMethod}
        />
        <TimeSelector
          selectedTime={selectedTime}
          onChange={setSelectedTime}
        />
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
  );
};

export default DonationModal;
