import { memo } from 'react';
import { Table, type Column, Button } from '@/shared/components';
import type { Customer } from '../types';

interface CustomerTableProps {
  customers: Customer[];
  onShowOrders: (customerId: number) => void;
}

const BASE_COLUMNS: Omit<Column<Customer>, 'render'>[] = [
  { key: 'id', header: 'ID' },
  { key: 'title', header: 'Title' },
  { key: 'lastname', header: 'Last Name' },
  { key: 'firstname', header: 'First Name' },
  { key: 'postalCode', header: 'Postal Code' },
  { key: 'city', header: 'City' },
  { key: 'email', header: 'Email' },
];

export const CustomerTable = memo(function CustomerTable({
  customers,
  onShowOrders,
}: CustomerTableProps) {
  const columns: Column<Customer>[] = [
    ...BASE_COLUMNS,
    {
      key: 'actions',
      header: 'Actions',
      render: customer => (
        <Button variant="primary" size="sm" onClick={() => onShowOrders(customer.id)}>
          Show Orders
        </Button>
      ),
    },
  ];

  return (
    <Table
      data={customers}
      columns={columns}
      keyExtractor={customer => customer.id}
      emptyMessage="No customers found"
    />
  );
});

export default CustomerTable;
