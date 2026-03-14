import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/test-utils';
import { OrdersPage } from '@/pages';
import { customerService } from '@/features/customers';
import type { CustomerOrdersResponse } from '@/features/customers';

// Mock react-router-dom useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ customerId: '1' }),
  };
});

// Mock the customer service
vi.mock('@/features/customers/api', () => ({
  customerService: {
    fetchCustomers: vi.fn(),
    fetchCustomerOrders: vi.fn(),
  },
}));

const mockOrdersResponse: CustomerOrdersResponse = {
  customer: {
    id: 1,
    lastname: 'Norris',
  },
  orders: [
    {
      id: 1,
      purchaseIdentifier: 'PUR-001',
      productId: 100,
      quantity: 2,
      price: 49.99,
      currency: 'EUR',
      date: '2024-01-15',
    },
    {
      id: 2,
      purchaseIdentifier: 'PUR-002',
      productId: 101,
      quantity: 1,
      price: 29.99,
      currency: 'EUR',
      date: '2024-01-16',
    },
  ],
  total: 129.97,
  totalItems: 2,
};

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(customerService.fetchCustomerOrders).mockImplementation(() => new Promise(() => {}));

    render(<OrdersPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders customer orders after loading', async () => {
    vi.mocked(customerService.fetchCustomerOrders).mockResolvedValue(mockOrdersResponse);

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText(/orders for norris/i)).toBeInTheDocument();
    });

    expect(screen.getByText('PUR-001')).toBeInTheDocument();
    expect(screen.getByText('PUR-002')).toBeInTheDocument();
  });

  it('renders error message when API fails', async () => {
    vi.mocked(customerService.fetchCustomerOrders).mockRejectedValue(new Error('API Error'));

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays the total amount', async () => {
    vi.mocked(customerService.fetchCustomerOrders).mockResolvedValue(mockOrdersResponse);

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText(/total: 129.97 eur/i)).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    vi.mocked(customerService.fetchCustomerOrders).mockResolvedValue(mockOrdersResponse);

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText(/back to customers/i)).toBeInTheDocument();
    });
  });
});
