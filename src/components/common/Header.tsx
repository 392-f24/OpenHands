import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '@/hooks';

import { ConfirmationDialog } from '@/components/common';

const Header = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // State for Dialog visibility
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const routesNotShowingBackButton = ['/', '/schedule', '/saved', '/alerts'];

  // Show back button only on pages other than /
  const showBackButton = !routesNotShowingBackButton.includes(
    location.pathname
  );

  return (
    <AppBar
      position='sticky'
      sx={{ backgroundColor: 'primary.light', color: '#000' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showBackButton && (
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => navigate(-1)} // Back button
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </Box>

        <Typography
          variant='h6'
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 600,
            fontSize: '1.4rem',
          }}
        >
          OpenHands
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <IconButton
                edge='end'
                color='inherit'
                onClick={() => setOpenConfirmDialog(true)}
                aria-label='sign out'
              >
                <Avatar
                  alt={`${user.username} profile picture`}
                  src={user.profilePicture}
                  aria-label='profile picture'
                >
                  {/* Use username Initials of first 2 words */}
                  {user.username
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])}
                </Avatar>
              </IconButton>

              {/* Dialog for Confirm Sign Out */}
              <ConfirmationDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={async () => {
                  setOpenConfirmDialog(false);
                  // await handleSignOut();
                  navigate('/');
                }}
                title='Confirm Sign Out'
                description='Are you sure you want to sign out?'
                confirmText='Sign Out'
              />
            </>
          ) : (
            <Button
              color='inherit'
              // onClick={handleSignIn}
              aria-label='sign in'
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
