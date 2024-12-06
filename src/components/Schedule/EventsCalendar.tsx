import * as React from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

interface EventsCalendarProps {
  events: DonationEvent[];
  setSelectedDate: (date: Dayjs) => void;
}

const EventsCalendar = ({ events, setSelectedDate }: EventsCalendarProps) => {
  // Extract unique days with events
  const highlightedDays = React.useMemo(() => {
    return events
      .map((event) => {
        return dayjs(event.date).format('YYYY-MM-DD');
      })
      .filter(Boolean);
  }, [events]);

  const ServerDay = (
    props: PickersDayProps<Dayjs> & { highlightedDays?: string[] }
  ) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !outsideCurrentMonth &&
      highlightedDays.includes(day.format('YYYY-MM-DD'));

    return (
      <Badge
        key={day.toString()}
        overlap='circular'
        badgeContent={isSelected ? '•' : undefined}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '30px',
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        onChange={setSelectedDate}
        slots={{
          day: (dayProps) => (
            <ServerDay
              {...dayProps}
              highlightedDays={highlightedDays}
            />
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default EventsCalendar;
