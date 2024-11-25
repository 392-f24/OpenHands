const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Replace colons, dashes, and milliseconds
  return date
    .toISOString()
    .replace(/[:-]/g, '') // Remove colons and dashes
    .replace(/\.\d{3}/, ''); // Remove milliseconds
};

const createICSContent = (event: DonationEvent) => {
  const endTime = new Date(new Date(event.date).getTime() + 60 * 60 * 1000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenHands//Donation Event//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.date)}`,
    `DTEND:${formatDate(endTime.toISOString())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:Items: ${event.supplies
      .map((supply) => `${supply.itemName} (${supply.quantityProvided})`)
      .join(', ')}`,
    `UID:${event.eventId}-${formatDate(event.date)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n'); // use CRLF for better compatibility
};

const generateICSFile = (event: DonationEvent) => {
  const icsContent = createICSContent(event);
  const blob = new Blob([icsContent], {
    type: 'text/calendar;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = globalThis.URL.createObjectURL(blob);
  link.setAttribute('download', `donation-event-${event.eventId}.ics`);
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.URL.revokeObjectURL(link.href); // Clean up
};

export default generateICSFile;
