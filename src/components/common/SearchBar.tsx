import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'es-toolkit/compat';

const sanitizeQuery = (query: string): string => {
  return query.replace(/[^\s\w]/gi, '').trim();
};

interface SearchBarProps {
  onSearchChange: (query: string) => void;
}

const SearchBar = ({ onSearchChange }: SearchBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams({ search: value || '' }, { replace: true });
        onSearchChange(value);
      }, 300),
    [setSearchParams, onSearchChange]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const sanitizedQuery = sanitizeQuery(e.target.value);
      setQuery(sanitizedQuery);
      debouncedUpdate(sanitizedQuery);
    },
    [debouncedUpdate]
  );

  // Initialize the search query from URL on mount
  useEffect(() => {
    const initialQuery = searchParams.get('search') || '';
    setQuery(initialQuery);
    onSearchChange(initialQuery);
  }, [searchParams, onSearchChange]);

  return (
    <Box
      display='flex'
      alignItems='center'
      mt={3}
      mx={2}
    >
      <TextField
        label='Search organizations...'
        variant='outlined'
        fullWidth
        sx={{ marginRight: 1 }}
        value={query}
        onChange={handleInputChange}
      />
      <Button variant='contained'>Recommend</Button>
    </Box>
  );
};

export default SearchBar;
