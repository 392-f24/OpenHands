import { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import type { PickersDayProps } from '@mui/x-date-pickers';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useToggle } from '@zl-asica/react';

interface ScheduleBaseProps {
  events: DonationEvent[];
  title: string;
  description: string;
}

const ScheduleBase = ({ events, title, description }: ScheduleBaseProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<DonationEvent | null>(
    null
  );
  const [open, toggleOpen] = useToggle();

  const eventsForSelectedDate = events.filter((event) =>
    dayjs(event.date).isSame(selectedDate, 'day')
  );

  const handleEventClick = (event: DonationEvent) => {
    setSelectedEvent(event);
    toggleOpen();
  };

  const handleClose = () => {
    toggleOpen();
    setSelectedEvent(null);
  };

  const hasEventOnDate = (date: Dayjs) =>
    events.some((event) => dayjs(event.date).isSame(date, 'day'));

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant='h4'
        mb={2}
        textAlign='center'
      >
        {title}
      </Typography>
      <Typography
        variant='body2'
        mb={2}
        textAlign='center'
        color='text.secondary'
      >
        {description}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          displayStaticWrapperAs='desktop'
          // ! NEEDS TO BE FIXED
          // @ts-expect-error: Ignore for now
          renderDay={(
            day: Dayjs,
            _value: Dayjs,
            DayComponentProps: PickersDayProps<Dayjs>
          ) => {
            const isEventDay = hasEventOnDate(day);

            return (
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                <div>{DayComponentProps.children}</div>
                {isEventDay && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                    }}
                  />
                )}
              </Box>
            );
          }}
        />
      </LocalizationProvider>
      <Box mt={2}>
        <Typography
          variant='h6'
          mb={1}
        >
          Events for {selectedDate?.format('MMMM D, YYYY')}:
        </Typography>
        {eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map((event) => (
            <Box
              key={event.eventId}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                mb: 2,
                cursor: 'pointer',
              }}
              onClick={() => handleEventClick(event)}
            >
              <Typography
                variant='subtitle1'
                fontWeight='bold'
              >
                {event.title}
              </Typography>
              <Typography variant='body2'>{event.description}</Typography>
              <Typography
                variant='caption'
                color='text.secondary'
              >
                {dayjs(event.date).format('MMMM D, YYYY, h:mm A')}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography
            variant='body1'
            color='text.secondary'
          >
            No events for this date.
          </Typography>
        )}
      </Box>

      {/* Event Details Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
              >
                Title:
              </Typography>
              <Typography>{selectedEvent.title}</Typography>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                mt={2}
              >
                Description:
              </Typography>
              <Typography>{selectedEvent.description}</Typography>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                mt={2}
              >
                Date & Time:
              </Typography>
              <Typography>
                {dayjs(selectedEvent.date).format('MMMM D, YYYY, h:mm A')}
              </Typography>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                mt={2}
              >
                Supplies:
              </Typography>
              {selectedEvent.supplies.map((supply, index) => (
                <Typography key={index}>
                  {supply.itemName} - {supply.quantityProvided} provided
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color='primary'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleBase;
