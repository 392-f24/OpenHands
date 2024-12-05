import { Card, CardContent, Typography, List, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import NeedDialog from './NeedDialog';
import NeedListItem from './NeedListItem';
import EmptyStateMessage from './EmptyStateMessage';

import useNeeds from '@/hooks/useNeeds';

interface NeedsListProps {
  organization: OrganizationProfile;
}

const OrgNeedsList = ({ organization }: NeedsListProps) => {
  const { addNeed, updateNeed } = useNeeds();
  const [needs, setNeeds] = useState<Supply[]>(organization.needs || []);
  const [selectedNeed, setSelectedNeed] = useState<Supply | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddOrEditNeed = useCallback(
    async (need: Supply) => {
      try {
        if (selectedNeed) {
          // Edit existing need
          await updateNeed(organization, selectedNeed.itemName, need);
          setNeeds((prevNeeds) =>
            prevNeeds.map((n) =>
              n.itemName === selectedNeed.itemName ? need : n
            )
          );
          toast.success(`Need "${need.itemName}" updated successfully.`);
        } else {
          // Add new need
          await addNeed(
            organization,
            need.itemName,
            need.quantityNeeded,
            need.pickup,
            need.loanable,
            need.returnDate
          );
          setNeeds((prevNeeds) => [...prevNeeds, need]);
          toast.success(`Need "${need.itemName}" added successfully.`);
        }

        setIsDialogOpen(false);
        setSelectedNeed(null);
      } catch (error) {
        console.error('Error adding/updating need:', error);
        toast.error('Failed to add/update need. Please try again.');
      }
    },
    [addNeed, updateNeed, organization.uid, selectedNeed]
  );

  return (
    <Card>
      <CardContent>
        <Typography
          variant='h5'
          fontWeight='medium'
          mb={2}
        >
          Current Needs
        </Typography>

        <List>
          {needs && needs.length > 0 ? (
            needs.map((need, index) => (
              <NeedListItem
                key={index}
                need={need}
                onEdit={() => {
                  setSelectedNeed(need);
                  setIsDialogOpen(true);
                }}
              />
            ))
          ) : (
            <EmptyStateMessage />
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
