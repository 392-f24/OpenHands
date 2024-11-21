import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Collapse,
  Typography,
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
  const [isModalOpen, toggleModal] = useToggle();
  const [isExpanded, toggleExpand] = useToggle();
  const [roleDialogOpen, toggleRoleDialog] = useToggle();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    organization.needs.map(() => false)
  );

  const isSaved = useMemo(
    () => savedOrgs.some((org) => org.uid === organization.uid),
    [savedOrgs, organization.uid]
  );

  const checkedItemsList = useMemo(
    () => organization.needs.filter((_, index) => checkedItems[index]),
    [checkedItems, organization.needs]
  );

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
          <Button onClick={toggleExpand}>
            {isExpanded ? 'Hide Needs' : 'Show Needs'}
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </Button>
          {organization.loanable && <Button variant='outlined'>Loan</Button>}
          {user && (
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
            selectedNeeds={checkedItemsList}
          />
        </CardActions>
        <Collapse
          in={isExpanded}
          timeout='auto'
          unmountOnExit
        >
          <NeedsList
            needs={organization.needs}
            checkedItems={checkedItems}
            onToggle={handleCheckboxToggle}
          />
        </Collapse>
      </Card>

      <RoleSelectionModal
        open={roleDialogOpen}
        onClose={toggleRoleDialog}
      />
    </>
  );
};

export default OrganizationCard;
