import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
} from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';

interface Organization {
  id: number;
  name: string;
  location: string;
  description: string;
  website: string;
  needs: string[];
  loanable: boolean;
}

const SavedOrganizationCard: React.FC<{
  organization: Organization;
  onRemove: () => void;
}> = ({ organization, onRemove }) => {
  const theme = useTheme();

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
            variant='text'
            color='error'
            onClick={onRemove}
          >
            Remove
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
    </Card>
  );
};

export default SavedOrganizationCard;
