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
import { useEffect, useState } from 'react';
import { useToggle } from '@zl-asica/react';

import { useSaved } from '@/hooks';

import { DonationModal } from '@/components/common';

const OrganizationCard: React.FC<{ organization: OrganizationProfile }> = ({
  organization,
}) => {
  const theme = useTheme();
  const [isExpanded, toggleExpand] = useToggle();
  const { savedOrgs, toggleSavedOrg } = useSaved();
  const isSaved = savedOrgs.some((org) => org.uid === organization.uid);
  const [isModalOpen, toggleModal] = useToggle();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [checkedItemsList, setCheckedItemsList] = useState<string[]>([]);

  // Function to handle checkbox toggling
  const handleCheckboxToggle = (index: number) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  useEffect(() => {
    setCheckedItems(organization.needs.map(() => false));
  }, [organization.needs]);

  useEffect(() => {
    const checked = organization.needs.filter(
      (_: string, index: number) => checkedItems[index]
    );
    setCheckedItemsList(checked);
  }, [checkedItems, organization.needs]);

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
        {organization.needs.length > 0 ? (
          <List>
            {organization.needs.map((need: string, index: number) => (
              <ListItem key={index}>
                <Checkbox
                  checked={checkedItems[index]}
                  onChange={() => handleCheckboxToggle(index)}
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
      </Collapse>
    </Card>
  );
};

export default OrganizationCard;
