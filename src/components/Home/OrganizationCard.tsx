import React, { useState } from 'react';
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

interface Organization {
  id: number;
  name: string;
  location: string;
  description: string;
  website: string;
  needs: string[];
  loanable: boolean;
}

const OrganizationCard: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const toggleSave = () => setIsSaved((prev) => !prev);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        title={organization.name}
        subheader={organization.location}
        action={
          <Button
            color={isSaved ? 'secondary' : 'primary'}
            onClick={toggleSave}
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
        <Button variant='contained'>Donate</Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout='auto'
        unmountOnExit
      >
        <List>
          {organization.needs.map((need, index) => (
            <ListItem key={index}>
              <Checkbox />
              <ListItemText primary={need} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
};

export default OrganizationCard;
