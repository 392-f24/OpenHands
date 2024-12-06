// import { TextField, Box} from '@mui/material';

// interface SearchBarProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({
//   searchQuery,
//   setSearchQuery,
// }) => (
//   <Box
//     display='flex'
//     alignItems='center'
//     mt={3}
//     mx={2}
//   >
//     <TextField
//       label='Search organizations...'
//       variant='outlined'
//       fullWidth
//       sx={{ marginRight: 1 }}
//       value={searchQuery}
//       onChange={(e) => setSearchQuery(e.target.value)}
//     />
//   </Box>
// );

// export default SearchBar;

import { TextField, Box } from '@mui/material';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => (
  <TextField
    label='Search organizations...'
    variant='outlined'
    fullWidth
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);

export default SearchBar;
