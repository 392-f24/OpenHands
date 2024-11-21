import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Collapse,
  List,
  Typography,
  Checkbox,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { lighten, useTheme } from '@mui/material/styles';
import { useState, useMemo } from 'react';
import { useToggle } from '@zl-asica/react';

import DonationModal from './DonationModal';

import { useSavedOrgs } from '@/hooks';

const NeedsList: React.FC<{
  needs: string[];
  checkedItems: boolean[];
  onToggle: (index: number) => void;
}> = ({ needs, checkedItems, onToggle }) => (
  <>
    {needs.length > 0 ? (
      <List>
        {needs.map((need, index) => (
          <ListItem key={index}>
            <Checkbox
              checked={checkedItems[index]}
              onChange={() => onToggle(index)}
            />
            <ListItemText primary={need} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography
        variant='body1'
        color='text.secondary'
        m={2}
      >
        No current needs.
      </Typography>
    )}
  </>
);

const OrganizationCard: React.FC<{ organization: OrganizationProfile }> = ({
  organization,
}) => {
  const theme = useTheme();
  const { savedOrgs, updateSavedOrgs } = useSavedOrgs();
  const [isModalOpen, toggleModal] = useToggle();
  const [isExpanded, toggleExpand] = useToggle();
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

  const handleCheckboxToggle = (index: number) => {
    setCheckedItems((prevCheckedItems) =>
      prevCheckedItems.map((item, i) => (i === index ? !item : item))
    );
  };

  const cardStyles = {
    mt: 2,
    mx: 2,
    backgroundColor: lighten(theme.palette.primary.light, 0.8),
  };

  return (
    <Card sx={cardStyles}>
      <CardHeader
        title={organization.name}
        subheader={organization.location}
        action={
          <Button
            color={isSaved ? 'secondary' : 'primary'}
            onClick={() => updateSavedOrgs(organization)}
          >
            {isSaved ? 'Unsave' : 'Save'}
          </Button>
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
        <Button
          variant='contained'
          onClick={toggleModal}
        >
          Donate
        </Button>
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
  );
};

export default OrganizationCard;
