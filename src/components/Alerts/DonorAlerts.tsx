import {
  Box,
  Typography,
  List,
  ListItem,
  Card,
  CardHeader,
  Button,
} from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { useOrganizationStore } from '@/stores';
import { useSavedOrgs } from '@/hooks';

const DonorAlerts = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { savedOrgs } = useSavedOrgs();
  const savedOrgUids = new Set(savedOrgs.map((org) => org.uid));

  const organizationProfiles = useOrganizationStore(
    (state) => state.organizationProfiles
  );

  // Filtered organizations based on savedOrgUids
  const filteredOrganizations = organizationProfiles.filter((org) =>
    savedOrgUids.has(org.uid)
  );

  // Get recently added needs
  const recentNeeds = [];
  for (const org of filteredOrganizations) {
    if (org.needs) {
      for (const need of org.needs) {
        const createdAt = new Date(need.createdAt);
        const now = new Date();
        const timeDiffMs = now.getTime() - createdAt.getTime();
        const hoursAgo = Math.floor(timeDiffMs / (1000 * 60 * 60));
        const name = org.name;

        if (hoursAgo <= 48) {
          recentNeeds.push({
            need,
            hoursAgo,
            name,
          });
        }
      }
    }
  }

  const handleViewItem = (orgName: string) => {
    navigate(`/?search=${encodeURIComponent(orgName)}`);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Typography
        variant='h4'
        sx={{ mb: 1, ml: 2 }}
      >
        Alerts
      </Typography>
      <Typography
        variant='subtitle1'
        color='text.secondary'
        sx={{ mb: 3, ml: 2 }}
      >
        Needs recently added by your saved organizations
      </Typography>
      {recentNeeds.length > 0 ? (
        <List sx={{ mt: 2 }}>
          {recentNeeds.map((needData, index) => (
            <ListItem key={index}>
              <Card
                sx={{
                  width: '100%',
                  backgroundColor: lighten(theme.palette.primary.light, 0.8),
                  boxShadow: theme.shadows[1],
                }}
              >
                <CardHeader
                  title={
                    <Typography variant='h6'>
                      {needData.need.itemName}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      variant='body2'
                      color='text.secondary'
                    >
                      Added {needData.hoursAgo} hours ago by {needData.name}
                    </Typography>
                  }
                  action={
                    <Button
                      variant='text'
                      onClick={() => handleViewItem(needData.name)}
                      sx={{ textTransform: 'none' }}
                    >
                      View Item
                    </Button>
                  }
                />
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography
          variant='body1'
          color='text.secondary'
          align='center'
          sx={{ mt: 5 }}
        >
          No recent needs found.
        </Typography>
      )}
    </Box>
  );
};

export default DonorAlerts;
