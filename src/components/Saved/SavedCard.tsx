import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
} from '@mui/material';
import { lighten, useTheme } from '@mui/material/styles';

const SavedOrganizationCard: React.FC<{
  organization: OrganizationProfile;
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.25rem',
              mt: 1,
            }}
          >
            <Button
              size='small'
              variant='text'
              color='error'
              onClick={onRemove}
            >
              Unsaved
            </Button>
            <Button
              size='small'
              sx={{ width: 'fit-content' }}
              href={organization.website}
              target='_blank'
            >
              Visit Website
            </Button>
          </Box>
        }
      />
      <CardContent>
        <Typography
          variant='body2'
          color='text.secondary'
        >
          {organization.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SavedOrganizationCard;
