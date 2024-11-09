import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Get the index of the page based on the path
const getPageIndex = (path: string) => {
  switch (path) {
    case '/':
      return 0;
    case '/me':
      return 1;
    default:
      return 0;
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
        icon={<HomeIcon />}
        component={Link}
        to='/'
      />
      <BottomNavigationAction
        label='Me'
        icon={<PersonIcon />}
        component={Link}
        to='/me'
      />
    </BottomNavigation>
  );
}
