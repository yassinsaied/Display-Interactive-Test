import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout, Spinner, ErrorMessage, Button, SearchInput, Pagination } from '@/shared/components';
import { customerService, CustomerOrdersList } from '@/features/customers';
import { useSearch } from '@/shared/hooks';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export function OrdersPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { searchTerm, debouncedTerm, setSearch } = useSearch();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [debouncedTerm, itemsPerPage]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders', customerId, page, itemsPerPage, debouncedTerm],
    queryFn: () =>
      customerService.fetchCustomerOrders(
        Number(customerId),
        page,
        itemsPerPage,
        debouncedTerm || undefined
      ),
    enabled: !!customerId,
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/customers')}
          leftIcon={<span>←</span>}
        >
          Back to Customers
        </Button>

        {data && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Orders for {data.customer.lastname || 'N/A'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Customer ID: {data.customer.id}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {data && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {data.orders.length} of {data.totalItems} orders
                {debouncedTerm && <span className="ml-1">for &quot;{debouncedTerm}&quot;</span>}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="ordersPageSize" className="text-sm text-gray-500 dark:text-gray-400">
                  Show
                </label>
                <select
                  id="ordersPageSize"
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
          )}
          <SearchInput
            value={searchTerm}
            onChange={setSearch}
            placeholder="Search by Purchase ID, Product ID..."
            className="max-w-sm"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner centered size="lg" label="Loading orders..." />
          </div>
        )}

        {isError && (
          <ErrorMessage
            title="Error"
            message={error instanceof Error ? error.message : 'Failed to load orders'}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            <CustomerOrdersList data={data} />
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              hasNextPage={data.hasNextPage}
              hasPreviousPage={data.hasPreviousPage}
              onNextPage={() => data.hasNextPage && setPage(p => p + 1)}
              onPreviousPage={() => data.hasPreviousPage && setPage(p => p - 1)}
              onGoToPage={p => setPage(Math.max(1, Math.min(p, data.totalPages)))}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default OrdersPage;

