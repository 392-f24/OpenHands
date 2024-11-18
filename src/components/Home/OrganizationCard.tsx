import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { lighten, useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { useToggle } from '@/hooks';

import DonationModal from '@/components/common/DonationModal';

import useSaved from '@/hooks/useSaved';

const OrganizationCard: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const theme = useTheme();
  const [isExpanded, toggleExpand] = useToggle();
  const { savedOrgs, toggleSavedOrg } = useSaved();
  const isSaved = savedOrgs.some((org) => org.id === organization.id);
  const [isModalOpen, setModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    organization.needs.map(() => false) // initialize all items as unchecked
  );

  // Function to handle checkbox toggling
  const handleCheckboxToggle = (index: number) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  // Function to get the list of checked items
  const getCheckedItems = () => {
    return organization.needs.filter((_, index) => checkedItems[index]);
  };

  return (
    <Card
      sx={{
        mt: 2,
        mx: 2,
        backgroundColor: lighten(theme.palette.primary.light, 0.8),
      }}
    >
      <CardHeader
        title={organization.name}
        subheader={organization.location}
        action={
          <Button
            color={isSaved ? 'secondary' : 'primary'}
            onClick={() => toggleSavedOrg(organization)}
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
          onClick={() => setModalOpen(true)}
        >
          Donate
        </Button>
        <DonationModal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          organization={organization}
          selectedNeeds={getCheckedItems()}
        />
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout='auto'
        unmountOnExit
      >
        <List>
          {organization.needs.map((need, index) => (
            <ListItem key={index}>
              <Checkbox
                checked={checkedItems[index]}
                onChange={() => handleCheckboxToggle(index)}
              />
              <ListItemText primary={need} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
};

export default OrganizationCard;
