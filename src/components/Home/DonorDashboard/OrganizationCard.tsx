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
import { toast } from 'sonner';

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
    organization.needs?.map(() => false) ?? []
  );

  const isSaved = useMemo(
    () => savedOrgs.some((org) => org.uid === organization.uid),
    [savedOrgs, organization.uid]
  );

  const checkedItemsList = useMemo(
    () => organization.needs?.filter((_, index) => checkedItems[index]) ?? [],
    [checkedItems, organization.needs]
  );

  const handleAction = useCallback(
    async (action: 'save' | 'donate') => {
      if (!user) {
        toggleRoleDialog();
        return;
      }

      if (action === 'save') {
        await updateSavedOrgs(organization);
        toast.success(`${isSaved ? 'Unsaved' : 'Saved'} ${organization.name}`);
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

  // Extracted component for header actions
  const HeaderActions = () =>
    user && (
      <Button
        color={isSaved ? 'secondary' : 'primary'}
        onClick={() => handleAction('save')}
      >
        {isSaved ? 'Unsave' : 'Save'}
      </Button>
    );

  // Extracted component for needs section
  const NeedsSection = () =>
    hasNeeds ? (
      <Collapse
        in={isExpanded}
        timeout='auto'
        unmountOnExit
      >
        <Divider />
        <NeedsList
          needs={organization.needs?.filter((need) => !need.status) ?? []}
          checkedItems={checkedItems}
          onToggle={handleCheckboxToggle}
          loggedIn={Boolean(user)}
        />
      </Collapse>
    ) : (
      <Typography
        variant='body1'
        color='text.secondary'
        textAlign='center'
        m={2}
      >
        No current needs.
      </Typography>
    );

  const hasNeeds = (organization.needs?.length ?? 0) > 0;

  return (
    <>
      <Card sx={cardStyles}>
        <CardHeader
          title={organization.name}
          subheader={organization.location}
          action={<HeaderActions />}
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
            sx={{ mt: 1 }}
          >
            Visit Website
          </Button>
        </CardContent>
        <CardActions>
          {hasNeeds && (
            <Button
              onClick={toggleExpand}
              startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
            >
              {isExpanded ? 'Hide Needs' : 'Show Needs'}
            </Button>
          )}
          {hasNeeds && user && (
            <Button
              variant='contained'
              onClick={() => handleAction('donate')}
              disabled={checkedItemsList?.length === 0}
            >
              Donate
            </Button>
          )}
          <DonationModal
            open={isModalOpen}
            onClose={toggleModal}
            organization={organization}
            selectedNeeds={checkedItemsList?.map((need) => need.itemName) ?? []}
            donor={(user as DonorProfile) ?? {}}
          />
        </CardActions>
        <NeedsSection />
      </Card>
      <RoleSelectionModal
        open={roleDialogOpen}
        onClose={toggleRoleDialog}
      />
    </>
  );
};

export default OrganizationCard;
