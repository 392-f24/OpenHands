import { useEffect } from 'react';
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
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { useOrganizationStore } from '@/stores';
import { useSavedOrgs } from '@/hooks';

import { LoadingCircle } from '@/components/common';

const DonorAlerts = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { savedOrgs } = useSavedOrgs();
  const savedOrgUids = new Set(savedOrgs.map((org) => org.uid));

  const {
    organizationProfiles,
    fetchProfiles,
    subscribeToProfiles,
    loading,
    error,
  } = useOrganizationStore();

  useEffect(() => {
    fetchProfiles();
    const unsubscribe = subscribeToProfiles;

    return () => unsubscribe && unsubscribe();
  }, [fetchProfiles, subscribeToProfiles]);

  if (loading) return <LoadingCircle />;
  if (error) {
    toast.error(error);
    return <p>{error}</p>;
  }

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

  // Function to handle navigation
  const handleViewItem = (orgName: string) => {
    navigate(`/?search=${encodeURIComponent(orgName)}`);
  };

  return (
    <Box>
      <h1 style={{ marginLeft: '20px' }}>Alerts</h1>
      <h4 style={{ marginLeft: '20px' }}>
        Needs recently added by your saved organizations
      </h4>
      {recentNeeds.length > 0 ? (
        <List sx={{ mt: 2 }}>
          {recentNeeds.map((needData, index) => (
            <ListItem key={index}>
              <Card
                sx={{
                  width: '100%',
                  backgroundColor: lighten(theme.palette.primary.light, 0.8),
                }}
              >
                <CardHeader
                  title={needData.need.itemName}
                  subheader={`Added ${needData.hoursAgo} hours ago by ${needData.name}`}
                  action={
                    <Button
                      variant='text'
                      onClick={() => handleViewItem(needData.name)}
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
          m={5}
        >
          No recent needs found.
        </Typography>
      )}
    </Box>
  );
};

export default DonorAlerts;
