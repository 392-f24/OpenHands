import {
  Home,
  CalendarMonth,
  Bookmark,
  Notifications,
} from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

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
        zIndex: 1000, // Ensure the footer is always on top
      }}
    >
      <BottomNavigationAction
        label='Home'
        icon={<Home />}
        component={Link}
        to='/'
      />
      <BottomNavigationAction
        label='Schedule'
        icon={<CalendarMonth />}
        component={Link}
        to='/schedule'
      />
      <BottomNavigationAction
        label='Saved'
        icon={<Bookmark />}
        component={Link}
        to='/saved'
      />
      <BottomNavigationAction
        label='Alerts'
        icon={<Notifications />}
        component={Link}
        to='/alerts'
      />
    </BottomNavigation>
  );
};
export default Footer;
