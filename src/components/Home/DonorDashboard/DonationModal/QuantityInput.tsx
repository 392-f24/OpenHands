import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuantityInputProps {
  organization: OrganizationProfile;
  selectedNeeds: string[];
  providedQuantities: { [key: string]: number };
  onChange: (quantities: { [key: string]: number }) => void;
}

const QuantityInput = ({
  organization,
  selectedNeeds,
  providedQuantities,
  onChange,
}: QuantityInputProps) => {
  const handleQuantityChange = (needName: string, quantity: number) => {
    if (quantity < 0) return;
    onChange({ ...providedQuantities, [needName]: quantity });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant='subtitle1'
        fontWeight='bold'
        mb={2}
      >
        Provide Quantities for Selected Needs:
      </Typography>
      {selectedNeeds.map((needName) => {
        const need = organization.needs?.find((n) => n.itemName === needName);
        const remaining = need?.quantityNeeded || 0;
        const provided = providedQuantities[needName] || 0;

        const progress = remaining > 0 ? (provided / remaining) * 100 : 100;

        return (
          <Box
            key={needName}
            sx={{
              mb: 2,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '12px',
              backgroundColor: 'background.default',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Typography
              variant='body1'
              fontWeight='bold'
              textAlign='center'
              mb={1}
            >
              {need?.itemName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant='determinate'
                value={Math.min(progress, 100)}
                sx={{
                  flex: 1,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'grey.300',
                }}
              />
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ minWidth: '60px', textAlign: 'right' }}
              >
                {remaining} still needed
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mt: 2,
              }}
            >
              <IconButton
                size='medium'
                onClick={() =>
                  handleQuantityChange(needName, Math.max(provided - 1, 0))
                }
                disabled={provided <= 0}
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' },
                  p: 1.5,
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type='number'
                value={provided}
                onChange={(event_) =>
                  handleQuantityChange(needName, Number(event_.target.value))
                }
                slotProps={{
                  input: {
                    style: { textAlign: 'center' },
                  },
                  htmlInput: {
                    min: 0,
                    max: remaining,
                  },
                }}
                size='small'
                sx={{
                  width: '70px',
                  '& input': {
                    padding: '10px',
                    fontSize: '1rem',
                  },
                }}
              />
              <IconButton
                size='medium'
                onClick={() =>
                  handleQuantityChange(
                    needName,
                    Math.min(provided + 1, remaining)
                  )
                }
                disabled={provided >= remaining}
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' },
                  p: 1.5,
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default QuantityInput;
