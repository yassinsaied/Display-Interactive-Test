import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout, Spinner, ErrorMessage, Pagination, SearchInput } from '@/shared/components';
import { customerService } from '@/features/customers';
import { CustomerTable } from '@/features/customers';
import { useSearch } from '@/shared/hooks';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function CustomersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { searchTerm, debouncedTerm, setSearch } = useSearch();

  useEffect(() => {
    setPage(1);
  }, [debouncedTerm, itemsPerPage]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['customers', page, itemsPerPage, debouncedTerm],
    queryFn: () => customerService.fetchCustomers(page, itemsPerPage, debouncedTerm || undefined),
  });

  const totalPages = data?.totalPages ?? 1;
  const hasNextPage = data?.hasNextPage ?? false;
  const hasPreviousPage = data?.hasPreviousPage ?? false;

  return (
    <PageLayout title="Customers" subtitle="Manage your customer database">
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Spinner centered size="lg" label="Loading customers..." />
        </div>
      )}

      {isError && (
        <ErrorMessage
          title="Error"
          message={error instanceof Error ? error.message : 'Failed to load customers'}
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {data.data.length} of {data.totalItems} customers
                {debouncedTerm && <span className="ml-1">for "{debouncedTerm}"</span>}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-500 dark:text-gray-400">
                  Show
                </label>
                <select
                  id="pageSize"
                  value={itemsPerPage}
                  onChange={e => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SearchInput
              value={searchTerm}
              onChange={setSearch}
              placeholder="Search by name, email, city..."
              className="w-full sm:w-72"
            />
          </div>

          <CustomerTable customers={data.data} onShowOrders={id => navigate(`/orders/${id}`)} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNextPage={() => hasNextPage && setPage(p => p + 1)}
            onPreviousPage={() => hasPreviousPage && setPage(p => p - 1)}
            onGoToPage={p => setPage(Math.max(1, Math.min(p, totalPages)))}
          />
        </div>
      )}
    </PageLayout>
  );
}

export default CustomersPage;
