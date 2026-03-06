import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '@/shared/hooks';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('initializes with custom values', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 2, limit: 20, totalItems: 100 })
    );

    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(20);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, limit: 10 }));

    expect(result.current.page).toBe(1);
    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
  });

  it('navigates to previous page', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 3, totalItems: 30, limit: 10 })
    );

    expect(result.current.page).toBe(3);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.page).toBe(2);
  });

  it('does not go below page 1', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30 }));

    expect(result.current.page).toBe(1);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.page).toBe(1);
  });

  it('does not exceed total pages', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 3, totalItems: 30, limit: 10 })
    );

    expect(result.current.page).toBe(3);
    expect(result.current.totalPages).toBe(3);

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(3);
  });

  it('goes to specific page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 50, limit: 10 }));

    act(() => {
      result.current.goToPage(4);
    });

    expect(result.current.page).toBe(4);
  });

  it('constrains goToPage within bounds', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, limit: 10 }));

    act(() => {
      result.current.goToPage(10);
    });

    expect(result.current.page).toBe(3); // max page

    act(() => {
      result.current.goToPage(-5);
    });

    expect(result.current.page).toBe(1); // min page
  });

  it('resets to initial page', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 1, totalItems: 50, limit: 10 })
    );

    act(() => {
      result.current.goToPage(4);
    });

    expect(result.current.page).toBe(4);

    act(() => {
      result.current.resetPage();
    });

    expect(result.current.page).toBe(1);
  });
});
