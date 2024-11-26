import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { LocalShipping, Home } from '@mui/icons-material';

import { DeliveryMethod } from './types';

interface DeliveryMethodSelectorProps {
  method: DeliveryMethod;
  isPickupAvailable: boolean;
  onChange: (method: DeliveryMethod) => void;
}

const DeliveryMethodSelector = ({
  method,
  isPickupAvailable,
  onChange,
}: DeliveryMethodSelectorProps) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant='subtitle1'
      fontWeight='bold'
      mb={1}
    >
      Select a Delivery Method:
    </Typography>
    <ToggleButtonGroup
      value={method}
      exclusive
      onChange={(_, value) => value && onChange(value as DeliveryMethod)}
      sx={{ display: 'flex', gap: 2 }}
    >
      <ToggleButton
        value={DeliveryMethod.DROP_OFF}
        sx={{
          flex: 1,
          ...(isPickupAvailable
            ? {}
            : {
                cursor: 'not-allowed',
                backgroundColor: 'primary.main',
                color: 'white',
              }),
        }}
        disabled={!isPickupAvailable}
      >
        <LocalShipping />
        <Typography ml={1}>
          {isPickupAvailable ? 'Drop-off' : 'Drop-off Only'}
        </Typography>
      </ToggleButton>
      {isPickupAvailable && (
        <ToggleButton
          value={DeliveryMethod.PICK_UP}
          sx={{ flex: 1, ml: 1 }}
        >
          <Home />
          <Typography ml={1}>Pick-up</Typography>
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  </Box>
);

export default DeliveryMethodSelector;
