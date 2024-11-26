import { Box, Typography } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type dayjs from 'dayjs';

interface TimeSelectorProps {
  selectedTime: dayjs.Dayjs | null;
  onChange: (time: dayjs.Dayjs | null) => void;
}

const TimeSelector = ({ selectedTime, onChange }: TimeSelectorProps) => (
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
        onChange={onChange}
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
);

export default TimeSelector;
