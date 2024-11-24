import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Typography,
} from '@mui/material';

interface NeedsListProps {
  needs: Supply[]; // Updated to match the new schema
  checkedItems: boolean[];
  onToggle: (index: number) => void;
  loggedIn: boolean; // Indicates if the user is logged in
}

const NeedsList = ({
  needs,
  checkedItems,
  onToggle,
  loggedIn,
}: NeedsListProps) => (
  <List>
    {needs.length > 0 ? (
      needs.map((need, index) => (
        <ListItem key={index}>
          {/* Conditionally render the checkbox only if logged in */}
          {loggedIn && (
            <Checkbox
              checked={checkedItems[index]}
              onChange={() => onToggle(index)}
            />
          )}
          <ListItemText
            primary={
              <>
                <strong>{need.itemName}</strong> (Quantity Needed:{' '}
                {need.quantityNeeded})
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
                      ? `, Returnable After: ${new Date(need.returnDate).toLocaleDateString()}`
                      : ''}
                  </Typography>
                )}
                {need.status && (
                  <Typography
                    variant='body2'
                    color='textSecondary'
                  >
                    Status: {need.status ? 'Fulfilled' : 'Pending'}
                  </Typography>
                )}
              </>
            }
          />
        </ListItem>
      ))
    ) : (
      <Typography
        variant='body1'
        color='text.secondary'
        m={2}
      >
        No current needs.
      </Typography>
    )}
  </List>
);

export default NeedsList;
