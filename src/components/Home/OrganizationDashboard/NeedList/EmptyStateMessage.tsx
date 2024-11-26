import { ListItem, ListItemText, Typography } from '@mui/material';

const EmptyStateMessage = () => (
  <ListItem>
    <ListItemText
      primary={
        <Typography
          variant='body1'
          color='textSecondary'
          align='center'
          component='div'
        >
          No needs added yet. Click the button below to add your first need!
        </Typography>
      }
    />
  </ListItem>
);

export default EmptyStateMessage;
