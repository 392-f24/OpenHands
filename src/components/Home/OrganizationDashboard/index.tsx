import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

import OrganizationDashboard from './Dashboard';
import IncomingDonations from './IncomingDonations';

const OrganizationHome = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 2, pt: 1 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor='primary'
        indicatorColor='primary'
        variant='fullWidth'
        sx={{ mb: 3 }}
      >
        <Tab label='Dashboard' />
        <Tab label='Incoming Donations' />
      </Tabs>

      {activeTab === 0 && <OrganizationDashboard />}
      {activeTab === 1 && <IncomingDonations />}
    </Box>
  );
};

export default OrganizationHome;
