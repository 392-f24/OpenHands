import { Typography, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useCallback } from 'react';

interface NeedListItemProps {
  need: Supply;
  onEdit: () => void;
}

const NeedListItem = ({ need, onEdit }: NeedListItemProps) => {
  const renderSecondaryText = useCallback(() => {
    const details = [];
    if (need.pickup) {
      details.push('Pickup Available');
    }
    if (need.loanable) {
      details.push(
        `Loanable${
          need.returnDate
            ? `, Returnable After: ${new Date(
                need.returnDate
              ).toLocaleDateString()}`
            : ''
        }`
      );
    }

    return details.map((text, idx) => (
      <Typography
        key={idx}
        variant='body2'
        color='textSecondary'
        component='span'
        display='block'
      >
        {text}
      </Typography>
    ));
  }, [need]);

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge='end'
          onClick={onEdit}
        >
          <EditIcon />
        </IconButton>
      }
    >
      <ListItemText
        primary={
          <Typography
            variant='body1'
            fontWeight='bold'
            component='span'
          >
            {need.itemName} (Quantity: {need.quantityNeeded})
          </Typography>
        }
        secondary={<>{renderSecondaryText()}</>}
        secondaryTypographyProps={{ component: 'div' }}
      />
    </ListItem>
  );
};

export default NeedListItem;
