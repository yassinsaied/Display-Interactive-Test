import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  className,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
}: TableProps<T>) {
  const renderCell = (item: T, column: Column<T>, index: number): ReactNode => {
    if (column.render) {
      return column.render(item, index);
    }
    const value = item[column.key as keyof T];
    return value != null ? String(value) : '-';
  };

  return (
    <div className={cn('overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  striped && index % 2 === 1 && 'bg-gray-50 dark:bg-gray-900/50',
                  hoverable && 'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                )}
              >
                {columns.map(column => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
                      column.className
                    )}
                  >
                    {renderCell(item, column, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
