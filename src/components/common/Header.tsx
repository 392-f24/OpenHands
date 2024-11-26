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
import { useLocation, useNavigate } from 'react-router-dom';
import { useToggle } from '@zl-asica/react';

import { useUser } from '@/hooks';

import { RoleSelectionModal, ConfirmationDialog } from '@/components/common';

const Header = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Dialog visibility state
  const [confirmDialogOpen, toggleConfirmDialog] = useToggle();
  const [roleDialogOpen, toggleRoleDialog] = useToggle();

  // Pages where the back button should not be shown
  const routesWithoutBackButton = ['/', '/schedule', '/saved', '/alerts'];
  const showBackButton = !routesWithoutBackButton.includes(location.pathname);

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: 'primary.light',
        color: '#000',
        borderRadius: '0 0 8px 8px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
        {/* Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showBackButton && (
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </Box>

        {/* App Title */}
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

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              {/* User Avatar */}
              <IconButton
                edge='end'
                color='inherit'
                onClick={toggleConfirmDialog}
              >
                <Avatar
                  alt={`${user.name}'s profile picture`}
                  src={user.profilePic}
                >
                  {user.name
                    ?.split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('') || 'U'}
                </Avatar>
              </IconButton>

              {/* Sign-Out Confirmation Dialog */}
              <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={toggleConfirmDialog}
                onConfirm={async () => {
                  await logout(navigate);
                  toggleConfirmDialog();
                }}
                title='Sign Out'
                description='Are you sure you want to sign out?'
              />
            </>
          ) : (
            // Sign-In Button
            <Button
              color='inherit'
              onClick={toggleRoleDialog}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Role Selection */}
      <RoleSelectionModal
        open={roleDialogOpen}
        onClose={toggleRoleDialog}
      />
    </AppBar>
  );
};

export default Header;
