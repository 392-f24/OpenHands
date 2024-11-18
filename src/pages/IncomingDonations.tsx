import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const IncomingDonations = () => {
  // Default data for incoming donations
  const donations = [
    {
      id: 1,
      donorName: 'John Doe',
      items: ['Blankets', 'Canned Food', 'Toys'],
      date: '2024-11-15',
      message: 'Happy to help your cause!',
    },
    {
      id: 2,
      donorName: 'Jane Smith',
      items: ['Winter Coats', 'Books'],
      date: '2024-11-16',
      message: 'Best wishes for your organization!',
    },
    {
      id: 3,
      donorName: 'Mike Johnson',
      items: ['Kitchen Utensils', 'Non-perishable Food'],
      date: '2024-11-17',
      message: '',
    },
  ];
  return (
    <Box sx={{ padding: '16px' }}>
      <Typography
        variant='h4'
        gutterBottom
      >
        Incoming Donations
      </Typography>
      {donations.map((donation) => (
        <Card
          key={donation.id}
          sx={{ marginBottom: '16px', backgroundColor: 'primary.light' }}
        >
          <CardContent>
            <Typography variant='h6'>{donation.donorName}</Typography>
            <Typography
              variant='body2'
              color='textSecondary'
            >
              Donation Date: {donation.date}
            </Typography>
            <Typography
              variant='body1'
              sx={{ marginTop: '8px' }}
            >
              Items: {donation.items.join(', ')}
            </Typography>
            {donation.message && (
              <Typography
                variant='body2'
                sx={{ marginTop: '8px' }}
              >
                Message: {donation.message}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
export default IncomingDonations;
