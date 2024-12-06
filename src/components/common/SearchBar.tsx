import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
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
    <TextField
      label='Search organizations...'
      variant='outlined'
      fullWidth
      sx={{ mx: 1, mt: 3, mr: 2 }}
      value={query}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
