import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import NeedDialog from './NeedDialog';

import useNeeds from '@/hooks/useNeeds';

interface NeedsListProps {
  organization: OrganizationProfile;
}

const OrgNeedsList = ({ organization }: NeedsListProps) => {
  const { addNeed, updateNeed } = useNeeds();
  const [needs, setNeeds] = useState<Supply[]>(organization.needs); // Maintain local state for needs
  const [selectedNeed, setSelectedNeed] = useState<Supply | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddOrEditNeed = async (need: Supply) => {
    try {
      if (selectedNeed) {
        // Edit existing need
        await updateNeed(organization.uid, selectedNeed.itemName, need);
        const updatedNeeds = needs.map((n) =>
          n.itemName === selectedNeed.itemName ? need : n
        );
        setNeeds(updatedNeeds); // Update local state
      } else {
        // Add new need
        await addNeed(
          organization.uid,
          need.itemName,
          need.quantityNeeded,
          need.pickup,
          need.loanable,
          need.returnDate
        );
        setNeeds([...needs, need]); // Add new need to local state
      }

      setIsDialogOpen(false);
      setSelectedNeed(null);
    } catch (error) {
      console.error('Error adding/updating need:', error);
      alert('Failed to update needs. Please try again.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant='h5'
          sx={{ fontWeight: 'medium', mb: 2 }}
        >
          Current Needs
        </Typography>

        <List>
          {needs && needs.length > 0 ? (
            needs.map((need, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge='end'
                    onClick={() => {
                      setSelectedNeed(need);
                      setIsDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <>
                      <Typography
                        variant='body1'
                        fontWeight='bold'
                      >
                        {need.itemName} (Quantity: {need.quantityNeeded})
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      {need.pickup && (
                        <Typography
                          variant='body2'
                          color='textSecondary'
                        >
                          Pickup Available
                        </Typography>
                      )}
                      {need.loanable && (
                        <Typography
                          variant='body2'
                          color='textSecondary'
                        >
                          Loanable
                          {need.returnDate
                            ? `, Returnable After: ${new Date(
                                need.returnDate
                              ).toLocaleDateString()}`
                            : ''}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    variant='body1'
                    color='textSecondary'
                    align='center'
                  >
                    No needs added yet. Click the button below to add your first
                    need!
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>

        <Button
          startIcon={<AddIcon />}
          variant='contained'
          color='success'
          onClick={() => {
            setSelectedNeed(null);
            setIsDialogOpen(true);
          }}
          sx={{ mt: 2 }}
        >
          Add Need
        </Button>

        <NeedDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleAddOrEditNeed}
          need={selectedNeed}
        />
      </CardContent>
    </Card>
  );
};

export default OrgNeedsList;
