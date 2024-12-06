const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toISOString()
    .replace(/[:-]/g, '')
    .replace(/\.\d{3}/, '');
};

const downloadICSFile = (fileName: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = globalThis.URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.URL.revokeObjectURL(link.href); // Clean up
};

const createICSContent = (event: DonationEvent): string => {
  const endTime = new Date(new Date(event.date).getTime() + 60 * 60 * 1000);
  return [
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.date)}`,
    `DTEND:${formatDate(endTime.toISOString())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:Items: ${event.supplies
      .map((supply) => `${supply.itemName} (${supply.quantityProvided})`)
      .join(', ')}`,
    `UID:${event.eventId}-${formatDate(event.date)}`,
    'END:VEVENT',
  ].join('\r\n');
};

const createCombinedICSContent = (events: DonationEvent[]): string => {
  const eventContents = events
    .map((event) => createICSContent(event))
    .join('\r\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenHands//Combined Donation Events//EN',
    eventContents,
    'END:VCALENDAR',
  ].join('\r\n');
};

const generateICSFile = (event: DonationEvent): void => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenHands//Donation Event//EN',
    createICSContent(event),
    'END:VCALENDAR',
  ].join('\r\n');
  downloadICSFile(`openhands-donation-event-${event.eventId}.ics`, icsContent);
};

const generateCombinedICSFile = (events: DonationEvent[]): void => {
  const icsContent = createCombinedICSContent(events);
  downloadICSFile('openhands-donation-events.ics', icsContent);
};

export { generateICSFile, generateCombinedICSFile };
