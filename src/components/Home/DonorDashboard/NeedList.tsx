import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';

interface NeedsListProps {
  needs: Supply[];
  checkedItems: boolean[];
  onToggle: (index: number) => void;
  loggedIn: boolean;
}

const NeedsList = ({
  needs,
  checkedItems,
  onToggle,
  loggedIn,
}: NeedsListProps) => {
  const renderSecondaryText = (need: Supply) => {
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
    if (need.status) {
      details.push(`Status: ${need.status ? 'Fulfilled' : 'Pending'}`);
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
  };

  return (
    <List sx={{ padding: 0 }}>
      {needs.length > 0 ? (
        needs.map((need, index) => (
          <ListItem
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {loggedIn && need.quantityNeeded > 0 && (
              <Checkbox
                checked={checkedItems[index]}
                onChange={() => onToggle(index)}
                sx={{ marginRight: 2 }}
              />
            )}
            <Box>
              <ListItemText
                primary={
                  <Typography
                    variant='body1'
                    fontWeight='bold'
                    component='span'
                  >
                    {need.itemName} (Still Need: {need.quantityNeeded})
                  </Typography>
                }
                secondary={
                  <Box component='span'>{renderSecondaryText(need)}</Box>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </Box>
          </ListItem>
        ))
      ) : (
        <Typography
          variant='body1'
          color='text.secondary'
          textAlign='center'
          m={2}
          component='div'
        >
          No current needs.
        </Typography>
      )}
    </List>
  );
};

export default NeedsList;
