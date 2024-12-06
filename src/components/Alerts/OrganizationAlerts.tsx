import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import { useEventStore } from '@/stores';

import { getOrDefaultDocuments } from '@/utils/firebase';

const defaultDonorProfile: DonorProfile = {
  uid: '',
  name: '',
  email: '',
  profilePic: '',
  joinedEvents: [],
  createdAt: new Date().toISOString(),
  role: 'donor',
  providedSupplies: [],
  saved: [],
};

const OrganizationAlerts = () => {
  const events = useEventStore((store) => store.events);
  const [donorEmails, setDonorEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDonorEmails = async () => {
      const donorIds = events.map((event) => event.donorId);
      const donorProfiles = await getOrDefaultDocuments<DonorProfile>(
        donorIds,
        defaultDonorProfile
      );

      const emails: Record<string, string> = {};
      for (const profile of donorProfiles) {
        emails[profile.uid] = profile.email;
      }
      setDonorEmails(emails);
    };

    if (events.length > 0) {
      fetchDonorEmails();
    }
  }, [events]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant='h4'
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        Incoming Donations
      </Typography>
      {events.length > 0 ? (
        events.map((event) => (
          <Card
            key={event.eventId}
            sx={{
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <CardContent>
              <Typography
                variant='body2'
                sx={{ mb: 1 }}
              >
                <strong>Donor:</strong>{' '}
                {event.title.split('from')[1].trim() || 'Loading...'}{' '}
                {/* Display donor name */}
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 1 }}
              >
                <strong>Donor Email:</strong>{' '}
                {donorEmails[event.donorId] || 'Loading...'}{' '}
                {/* Display donor name */}
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 1 }}
              >
                <strong>Description:</strong> {event.description}
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 1 }}
              >
                <strong>Drop Off Date & Time:</strong>{' '}
                {dayjs(event.date).format('MMMM D, YYYY, h:mm A')}
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 2 }}
              >
                <strong>Supplies:</strong>
              </Typography>
              <List>
                {event.supplies.map((supply, index) => (
                  <ListItem
                    key={index}
                    sx={{ py: 0 }}
                  >
                    <ListItemText
                      primary={`${supply.itemName} - ${supply.quantityProvided} provided`}
                      primaryTypographyProps={{
                        variant: 'body2',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography
          variant='body1'
          color='text.secondary'
          textAlign='center'
        >
          No incoming donations at the moment.
        </Typography>
      )}
    </Box>
  );
};

export default OrganizationAlerts;
