interface Organization {
  id: number;
  name: string;
  location: string;
  description: string;
  website: string;
  needs: string[];
  loanable: boolean;
  pickup: boolean;
}

interface ScheduledDonation {
  organizationName: string;
  organizationLocation: string;
  items: string[];
  time: string; // ISO timestamp
  method: string;
}

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  donationDetails: ScheduledDonation;
};
