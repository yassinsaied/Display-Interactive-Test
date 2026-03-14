import { useState, useCallback } from 'react';

const DEFAULT_LIMIT = 10;

interface UsePaginationOptions {
  initialPage?: number;
  limit?: number;
  totalItems?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  resetPage: () => void;
}

export function usePagination({
  initialPage = 1,
  limit = DEFAULT_LIMIT,
  totalItems = 0,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const nextPage = useCallback(() => {
    setPage(prev => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage(prev => (prev > 1 ? prev - 1 : prev));
  }, []);

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
    },
    [totalPages]
  );

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  };
}

export default usePagination;
