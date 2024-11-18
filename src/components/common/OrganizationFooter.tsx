import { Person, List } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Determine the active page index based on the current path
const getPageIndex = (path: string) => {
  switch (path) {
    case '/organization-dashboard': {
      return 0;
    }
    case '/incoming-donations': {
      return 1;
    }
    default: {
      return 0;
    }
  }
};

const OrganizationFooter = () => {
  const location = useLocation();

  return (
    <BottomNavigation
      className='bottom-nav'
      value={getPageIndex(location.pathname)}
      showLabels
      sx={{
        backgroundColor: 'primary.light',
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <BottomNavigationAction
        label='Profile'
        icon={<Person />}
        component={Link}
        to='/organization-dashboard'
      />
      <BottomNavigationAction
        label='Incoming Donations'
        icon={<List />}
        component={Link}
        to='/incoming-donations'
      />
    </BottomNavigation>
  );
};

export default OrganizationFooter;
