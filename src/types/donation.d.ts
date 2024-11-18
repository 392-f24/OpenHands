interface ScheduledDonation {
  organizationName: string;
  organizationLocation: string;
  supplies: {
    itemName: string;
    quantityProvided: number;
  }[];
  time: string; // ISO timestamp
  method: string;
}

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  donationDetails: ScheduledDonation;
};
