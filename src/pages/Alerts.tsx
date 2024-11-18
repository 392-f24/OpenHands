import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';

const Alerts = () => {
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

  const theme = useTheme();

  return (
    <Box>
      <h1 style={{ marginLeft: '20px' }}>Alerts</h1>
      <Paper
        sx={{
          mt: 2,
          mx: 2,
          backgroundColor: lighten(theme.palette.primary.light, 0.8),
        }}
      >
        {alerts.length > 0 ? (
          <List>
            {alerts.map((alert) => (
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
            variant='h2'
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
