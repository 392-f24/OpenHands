const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toISOString()
    .replace(/[:-]/g, '')
    .replace(/\.\d{3}/, '');
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
  ].join('\r\n');
};

const generateICSFile = (event: DonationEvent) => {
  const icsContent = createICSContent(event);
  const blob = new Blob([icsContent], {
    type: 'text/calendar;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = globalThis.URL.createObjectURL(blob);
  link.setAttribute(
    'download',
    `openhands-donation-event-${event.eventId}.ics`
  );
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.URL.revokeObjectURL(link.href);
};

const createCombinedICSContent = (events: DonationEvent[]): string => {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenHands//Combined Donation Events//EN',
    ...events.flatMap((event) => {
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
      ];
    }),
    'END:VCALENDAR',
  ].join('\r\n');
};

const generateCombinedICSFile = (events: DonationEvent[]) => {
  const icsContent = createCombinedICSContent(events);
  const blob = new Blob([icsContent], {
    type: 'text/calendar;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = globalThis.URL.createObjectURL(blob);
  link.setAttribute('download', 'openhands-donation-events.ics');
  document.body.append(link);
  link.click();
  link.remove();
  globalThis.URL.revokeObjectURL(link.href); // Clean up
};

export { generateICSFile, generateCombinedICSFile };
