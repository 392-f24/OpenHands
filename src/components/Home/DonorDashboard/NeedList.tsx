import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Typography,
} from '@mui/material';

interface NeedsListProps {
  needs: string[];
  checkedItems: boolean[];
  onToggle: (index: number) => void;
}

const NeedsList = ({ needs, checkedItems, onToggle }: NeedsListProps) => (
  <List>
    {needs.length > 0 ? (
      needs.map((need, index) => (
        <ListItem key={index}>
          <Checkbox
            checked={checkedItems[index]}
            onChange={() => onToggle(index)}
          />
          <ListItemText primary={need} />
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
