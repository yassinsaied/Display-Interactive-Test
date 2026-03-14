import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/test-utils';
import { CustomersPage } from '@/pages';
import { customerService } from '@/features/customers';
import type { PaginatedResponse } from '@/shared/types';
import type { Customer } from '@/features/customers';

// Mock the customer service
vi.mock('@/features/customers/api', () => ({
  customerService: {
    fetchCustomers: vi.fn(),
    fetchCustomerOrders: vi.fn(),
  },
}));

const mockCustomersResponse: PaginatedResponse<Customer> = {
  data: [
    {
      id: 1,
      title: 'm',
      lastname: 'Norris',
      firstname: 'Chuck',
      postalCode: '83600',
      city: 'Fréjus',
      email: 'chuck@norris.com',
    },
    {
      id: 2,
      title: 'mme',
      lastname: 'Galante',
      firstname: 'Marie',
      postalCode: null,
      city: null,
      email: 'marie-galante@france.fr',
    },
  ],
  totalItems: 2,
};

describe('CustomersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(customerService.fetchCustomers).mockImplementation(() => new Promise(() => {}));

    render(<CustomersPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders customers table after loading', async () => {
    vi.mocked(customerService.fetchCustomers).mockResolvedValue(mockCustomersResponse);

    render(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByText('Norris')).toBeInTheDocument();
    });

    expect(screen.getByText('Chuck')).toBeInTheDocument();
    expect(screen.getByText('marie-galante@france.fr')).toBeInTheDocument();
  });

  it('renders error message when API fails', async () => {
    vi.mocked(customerService.fetchCustomers).mockRejectedValue(new Error('API Error'));

    render(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('renders Show Orders buttons for each customer', async () => {
    vi.mocked(customerService.fetchCustomers).mockResolvedValue(mockCustomersResponse);

    render(<CustomersPage />);

    await waitFor(() => {
      const buttons = screen.getAllByText('Show Orders');
      expect(buttons).toHaveLength(2);
    });
  });

  it('displays correct item count', async () => {
    vi.mocked(customerService.fetchCustomers).mockResolvedValue(mockCustomersResponse);

    render(<CustomersPage />);

    await waitFor(() => {
      expect(screen.getByText(/showing 2 of 2 customers/i)).toBeInTheDocument();
    });
  });
});
