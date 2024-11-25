import { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import EventsCalendar from './EventsCalendar';

import generateICSFile from '@/utils/generateICSFile';

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
  const [open, setOpen] = useState(false);

  const handleEventClick = (event: DonationEvent) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const eventsForSelectedDate = events.filter((event) =>
    dayjs(event.date).isSame(selectedDate, 'day')
  );

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

      <EventsCalendar
        events={events}
        setSelectedDate={setSelectedDate}
      />

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

              <Typography>
                {event.supplies.map((supply, index) => (
                  <Typography
                    key={index}
                    variant='caption'
                    color='text.secondary'
                  >
                    {supply.quantityProvided} provided
                  </Typography>
                ))}
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
              <IconButton
                color='primary'
                onClick={() => generateICSFile(selectedEvent)}
                sx={{ mt: 2 }}
              >
                <EventIcon />
                Export to Calendar
              </IconButton>
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
