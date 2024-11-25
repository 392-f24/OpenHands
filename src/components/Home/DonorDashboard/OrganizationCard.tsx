import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Collapse,
  Typography,
  Divider,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { lighten, useTheme } from '@mui/material/styles';
import { useState, useMemo, useCallback } from 'react';
import { useToggle } from '@zl-asica/react';

import DonationModal from './DonationModal';
import NeedsList from './NeedList';

import { useSavedOrgs, useUser } from '@/hooks';

import { RoleSelectionModal } from '@/components/common';

interface OrganizationCardProps {
  organization: OrganizationProfile;
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const { savedOrgs, updateSavedOrgs } = useSavedOrgs();
  const hasNeeds = organization.needs.length > 0;
  const [isModalOpen, toggleModal] = useToggle();
  const [isExpanded, toggleExpand] = useToggle();
  const [roleDialogOpen, toggleRoleDialog] = useToggle();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    organization.needs.map(() => false) // Initialize checked state for each need
  );

  const isSaved = useMemo(
    () => savedOrgs.some((org) => org.uid === organization.uid),
    [savedOrgs, organization.uid]
  );

  // Extract the list of selected needs (based on checked items)
  const checkedItemsList = useMemo(
    () => organization.needs.filter((_, index) => checkedItems[index]), // Return only checked needs
    [checkedItems, organization.needs]
  );

  // Handle actions (Save or Donate)
  const handleAction = useCallback(
    (action: 'save' | 'donate') => {
      if (!user) {
        toggleRoleDialog();
        return;
      }

      if (action === 'save') {
        updateSavedOrgs(organization);
      } else if (action === 'donate') {
        toggleModal();
      }
    },
    [user, organization, toggleModal, toggleRoleDialog, updateSavedOrgs]
  );

  // Toggle checkbox selection for needs
  const handleCheckboxToggle = useCallback((index: number) => {
    setCheckedItems((prevCheckedItems) =>
      prevCheckedItems.map((item, i) => (i === index ? !item : item))
    );
  }, []);

  const cardStyles = useMemo(
    () => ({
      mt: 2,
      mx: 2,
      backgroundColor: lighten(theme.palette.primary.light, 0.8),
    }),
    [theme]
  );

  return (
    <>
      <Card sx={cardStyles}>
        <CardHeader
          title={organization.name}
          subheader={organization.location}
          action={
            user && (
              <Button
                color={isSaved ? 'secondary' : 'primary'}
                onClick={() => handleAction('save')}
              >
                {isSaved ? 'Unsave' : 'Save'}
              </Button>
            )
          }
        />
        <CardContent>
          <Typography
            variant='body2'
            color='text.secondary'
          >
            {organization.description}
          </Typography>
          <Button
            size='small'
            href={organization.website}
            target='_blank'
          >
            Visit Website
          </Button>
        </CardContent>
        <CardActions>
          {hasNeeds && (
            <Button onClick={toggleExpand}>
              {isExpanded ? 'Hide Needs' : 'Show Needs'}
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </Button>
          )}
          {hasNeeds && user && (
            <Button
              variant='contained'
              onClick={() => handleAction('donate')}
            >
              Donate
            </Button>
          )}
          <DonationModal
            open={isModalOpen}
            onClose={toggleModal}
            organization={organization}
            selectedNeeds={checkedItemsList.map((need) => need.itemName)} // Pass selected item names to modal
            donor={(user as DonorProfile) ?? {}}
          />
        </CardActions>
        {hasNeeds ? (
          <Collapse
            in={isExpanded}
            timeout='auto'
            unmountOnExit
          >
            <Divider />
            <NeedsList
              needs={organization.needs.filter((need) => !need.status)} // Pass updated needs schema
              checkedItems={checkedItems}
              onToggle={handleCheckboxToggle}
              loggedIn={Boolean(user)} // Pass loggedIn status
            />
          </Collapse>
        ) : (
          <Typography
            variant='body1'
            color='text.secondary'
            m={2}
          >
            No current needs.
          </Typography>
        )}
      </Card>

      <RoleSelectionModal
        open={roleDialogOpen}
        onClose={toggleRoleDialog}
      />
    </>
  );
};

export default OrganizationCard;
