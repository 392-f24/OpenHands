import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Collapse,
  Typography,
  Divider,
  Link,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { lighten, useTheme } from '@mui/material/styles';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useToggle } from '@zl-asica/react';
import { toast } from 'sonner';

import DonationModal from './DonationModal';
import NeedsList from './NeedList';

import { useSavedOrgs } from '@/hooks';
import { useUserStore } from '@/stores';

import { RoleSelectionModal } from '@/components/common';

interface OrganizationCardProps {
  organization: OrganizationProfile;
}

const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const theme = useTheme();
  const user = useUserStore((state) => state.user);

  const { savedOrgs, updateSavedOrgs } = useSavedOrgs();
  const [isModalOpen, toggleModal] = useToggle();
  const [isExpanded, toggleExpand] = useToggle();
  const [roleDialogOpen, toggleRoleDialog] = useToggle();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  useEffect(() => {
    setCheckedItems(organization.needs?.map(() => false) ?? []);
  }, [organization.needs]);

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

  const HeaderActions = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        mt: 1,
      }}
    >
      {user && (
        <Button
          size='small'
          sx={{
            width: 'fit-content',
            backgroundColor: 'primary.light',
          }}
          color={isSaved ? 'secondary' : 'primary'}
          onClick={() => handleAction('save')}
        >
          {isSaved ? 'Unsaved' : 'Save'}
        </Button>
      )}
    </Box>
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
          subheader={
            <>
              {organization.location}
              <br />
              <Link
                href={organization.website}
                target='_blank'
                rel='noopener noreferrer'
                variant='button'
                sx={{
                  mt: -1,
                  textDecoration: 'none',
                  width: 'fit-content',
                  textTransform: 'none',
                }}
              >
                Visit Website
              </Link>
            </>
          }
          action={<HeaderActions />}
        />
        <CardContent>
          <Typography
            variant='body2'
            color='text.secondary'
          >
            {organization.description}
          </Typography>
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
