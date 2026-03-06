import { memo } from 'react';
import { Table, type Column } from '@/shared/components';
import type { Order, CustomerOrdersResponse } from '../types';

interface CustomerOrdersListProps {
  data: CustomerOrdersResponse;
}

export const CustomerOrdersList = memo(function CustomerOrdersList({
  data,
}: CustomerOrdersListProps) {
  const columns: Column<Order>[] = [
    {
      key: 'lastname',
      header: 'Last Name',
      render: () => data.customer.lastname || '-',
    },
    { key: 'purchaseIdentifier', header: 'Purchase ID' },
    { key: 'productId', header: 'Product ID' },
    { key: 'quantity', header: 'Quantity' },
    {
      key: 'price',
      header: 'Price',
      render: (order: Order) => order.price.toFixed(2),
    },
    { key: 'currency', header: 'Currency' },
    { key: 'date', header: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <Table
        data={data.orders}
        columns={columns}
        keyExtractor={order => order.id}
        emptyMessage="No orders found for this customer"
      />

      {data.orders.length > 0 && (
        <div className="p-4 bg-accent-50 dark:bg-accent-950 rounded-lg border border-accent-200 dark:border-accent-800 animate-fade-in">
          <p className="text-lg font-semibold text-accent-800 dark:text-accent-300">
            Total: {data.total.toFixed(2)} {data.orders[0]?.currency || 'EUR'}
          </p>
        </div>
      )}
    </div>
  );
});

export default CustomerOrdersList;
