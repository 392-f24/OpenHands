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

import { useUser } from '@/hooks';

const OrganizationAlerts = () => {
  const { events } = useUser();

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
