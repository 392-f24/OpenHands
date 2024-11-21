import {
  Home,
  CalendarMonth,
  Bookmark,
  Notifications,
} from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { useUser } from '@/hooks';

// Get the index of the page based on the path
const getPageIndex = (path: string) => {
  switch (path) {
    case '/': {
      return 0;
    }
    case '/schedule': {
      return 1;
    }
    case '/saved': {
      return 2;
    }
    case '/alerts': {
      return 3;
    }
    default: {
      return 0;
    }
  }
};

const Footer = () => {
  const { user } = useUser();
  const userType = user?.role || 'guest';
  const location = useLocation();

  // Build navigation actions as an array
  const navigationActions = [
    <BottomNavigationAction
      key='home'
      label='Home'
      icon={<Home />}
      component={Link}
      to='/'
    />,
  ];

  if (userType !== 'guest') {
    navigationActions.push(
      <BottomNavigationAction
        key='schedule'
        label='Schedule'
        icon={<CalendarMonth />}
        component={Link}
        to='/schedule'
      />
    );

    if (userType === 'donor') {
      navigationActions.push(
        <BottomNavigationAction
          key='saved'
          label='Saved'
          icon={<Bookmark />}
          component={Link}
          to='/saved'
        />
      );
    }

    navigationActions.push(
      <BottomNavigationAction
        key='alerts'
        label='Alerts'
        icon={<Notifications />}
        component={Link}
        to='/alerts'
      />
    );
  }

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
        zIndex: 1000, // Ensure the footer is always on top
      }}
    >
      {navigationActions}
    </BottomNavigation>
  );
};

export default Footer;
