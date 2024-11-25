/* eslint-disable unicorn/prefer-string-replace-all */
import { Button } from '@mui/material';
import { Event } from '@mui/icons-material';

interface CalendarExportButtonProps {
  event: DonationEvent;
}

export default function CalendarExportButton({
  event,
}: CalendarExportButtonProps) {
  const generateICSFile = () => {
    // Format date for ICS file (YYYYMMDDTHHMMSSZ)
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date
        .toISOString()
        .replace(/[:-]/g, '')
        .replace(/\.\d{3}/, '');
    };

    // Create ICS content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OpenHands//Donation Event//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(event.date)}`,
      // Add 1 hour duration by default
      `DTEND:${formatDate(new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString())}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:Items: ${event.supplies
        .map((supply) => `${supply.itemName} (${supply.quantityProvided})`)
        .join(', ')}`,
      `UID:${event.eventId}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    // Create and download the file
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = globalThis.URL.createObjectURL(blob);
    link.setAttribute('download', `donation-event-${event.eventId}.ics`);
    document.body.append(link);
    link.click();
    link.remove();
  };

  return (
    <Button
      variant='contained'
      color='primary'
      startIcon={<Event />}
      onClick={generateICSFile}
      sx={{ marginTop: '1rem' }}
    >
      Export to Calendar
    </Button>
  );
}
