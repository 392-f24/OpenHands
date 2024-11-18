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

import RoleSelectionModal from '@/components/RoleSelectionModal'; // For role selection
import { ConfirmationDialog } from '@/components/common';

import { handleLogin, handleSignOut } from '@/utils/auth'; // Login and sign-out functions

const Header = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // State for Dialog visibility
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);

  const routesNotShowingBackButton = ['/', '/schedule', '/saved', '/alerts'];

  // Show back button only on pages other than /
  const showBackButton = !routesNotShowingBackButton.includes(
    location.pathname
  );
  // Handle "Sign In" button click
  const handleSignIn = () => {
    setOpenRoleDialog(true); // Open role selection modal
  };

  // Handle role selection (Donor or Organization)
  const handleRoleSelection = async (role: 'donor' | 'organization') => {
    setOpenRoleDialog(false); // Close modal
    await handleLogin(navigate, role); // Login and navigate to the appropriate dashboard
  };

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
          {loading ? (
            <Typography>Loading...</Typography> // Show while checking auth state
          ) : user ? (
            <>
              {/* Avatar and Sign-Out */}
              <IconButton
                edge='end'
                color='inherit'
                onClick={() => setOpenConfirmDialog(true)}
              >
                <Avatar
                  alt={`${user.username}'s profile picture`}
                  src={user.profilePicture}
                >
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
                  await handleSignOut(navigate);
                }}
                title='Confirm Sign Out'
                description='Are you sure you want to sign out?'
                confirmText='Sign Out'
              />
            </>
          ) : (
            // Sign-In Button
            <Button
              color='inherit'
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        open={openRoleDialog}
        onClose={() => setOpenRoleDialog(false)}
        onSelectRole={handleRoleSelection}
      />
    </AppBar>
  );
};

export default Header;
