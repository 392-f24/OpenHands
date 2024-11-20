import { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import { useToggle } from '@zl-asica/react';

import { useEvents } from '@/hooks';

// Set the localizer to use moment.js
const localizer = momentLocalizer(moment); // Create localizer using moment

const Schedule = () => {
  const { events }: { events: ScheduledDonation[] } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<ScheduledDonation | null>(
    null
  ); // For the modal event details
  const [open, toggleOpen] = useToggle();

  // Convert ScheduledDonation to a calendar event format
  const calendarEvents: CalendarEvent[] = events.map((donation) => ({
    title: `${donation.organizationName}`,
    start: new Date(donation.time), // Convert string time to Date object
    end: new Date(new Date(donation.time).getTime() + 30 * 60 * 1000),
    donationDetails: donation, // Store the donation details in the event object
  }));

  // Event click handler to open the modal
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event.donationDetails); // Set the selected event's details
    toggleOpen();
  };

  // Handle closing the modal
  const handleClose = () => {
    toggleOpen();
    setSelectedEvent(null); // Clear selected event data
  };

  return (
    <div className='schedule-page'>
      <h1 style={{ marginLeft: '20px' }}>Schedule</h1>
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500, margin: '20px' }}
        onSelectEvent={handleEventClick}
      />

      {/* Modal to show event details */}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Donation Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <p>
                <strong>Organization:</strong> {selectedEvent.organizationName}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.organizationLocation}
              </p>
              <p>
                <strong>Items:</strong> {selectedEvent.items.join(', ')}
              </p>
              <p>
                <strong>Time:</strong>{' '}
                {moment(selectedEvent.time).format('MMMM Do YYYY, h:mm a')}
              </p>
              <p>
                <strong>Method:</strong> {selectedEvent.method}
              </p>
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
    </div>
  );
};

export default Schedule;
