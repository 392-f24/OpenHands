import { Home, Bookmark, Notifications } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Get the index of the page based on the path
const getPageIndex = (path: string) => {
  switch (path) {
    case '/': {
      return 0;
    }
    case '/saved': {
      return 1;
    }
    case '/alerts': {
      return 2;
    }
    default: {
      return 0;
    }
  }
};

export default function Footer() {
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
}
