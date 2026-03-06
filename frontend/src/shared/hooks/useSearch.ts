import { useState, useEffect, useCallback } from 'react';

interface UseSearchReturn {
  searchTerm: string;
  debouncedTerm: string;
  setSearch: (value: string) => void;
  resetSearch: () => void;
}

export function useSearch(delay = 400): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), delay);
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  const setSearch = useCallback((value: string) => setSearchTerm(value), []);
  const resetSearch = useCallback(() => setSearchTerm(''), []);

  return { searchTerm, debouncedTerm, setSearch, resetSearch };
}

export default useSearch;
