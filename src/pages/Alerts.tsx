import { Box, Divider, Paper, Typography } from '@mui/material';

const Alerts = ({ searchQuery }: { searchQuery: string }) => {
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
        <Typography
          variant='body2'
          color='text.secondary'
          align='center'
        >
          No alerts at this time.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Alerts;
