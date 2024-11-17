import {
  Box,
  Divider,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { filter, lowerCase } from 'es-toolkit/compat';

const Alerts = ({ searchQuery }: { searchQuery: string }) => {
  const alerts = [
    {
      id: 1,
      title: 'Food Shortage Alert',
      message: 'Urgent need for canned food in Downtown area.',
      category: 'Food',
    },
    {
      id: 2,
      title: 'Volunteers Needed',
      message: 'Animal Shelter needs volunteers this weekend.',
      category: 'Volunteer',
    },
    {
      id: 3,
      title: 'Funding Goal Reached',
      message: 'Youth Theater Company has reached its funding goal!',
      category: 'Funding',
    },
  ];

  // Filter alerts based on the search query
  const filteredAlerts = filter(alerts, (alert) => {
    const searchTerm = lowerCase(searchQuery);
    return (
      lowerCase(alert.title).includes(searchTerm) ||
      lowerCase(alert.message).includes(searchTerm) ||
      lowerCase(alert.category).includes(searchTerm)
    );
  });

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{ padding: 2, marginTop: 2 }}
      >
        <Typography
          variant='h6'
          align='center'
        >
          Alerts
        </Typography>
        <Divider sx={{ my: 1 }} />
        {filteredAlerts.length > 0 ? (
          <List>
            {filteredAlerts.map((alert) => (
              <ListItem key={alert.id}>
                <ListItemText
                  primary={alert.title}
                  secondary={`${alert.message} (Category: ${alert.category})`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant='body2'
            color='text.secondary'
            align='center'
          >
            No alerts match your search.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Alerts;
