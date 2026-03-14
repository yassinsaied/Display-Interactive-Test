import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customerService } from '@/features/customers';
import axiosInstance from '@/shared/lib/axios';

// Mock axios instance
vi.mock('@/shared/lib/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockCustomersApiResponse = {
  data: {
    'hydra:member': [
      { id: 1, lastname: 'Norris', firstname: 'Chuck' },
      { id: 2, lastname: 'Galante', firstname: 'Marie' },
    ],
    'hydra:totalItems': 25,
  },
};

const mockOrdersApiResponse = {
  data: {
    'hydra:member': [
      {
        id: 1,
        purchaseIdentifier: 'PUR-001',
        productId: 1221,
        quantity: 1,
        price: 49.99,
        currency: 'EUR',
        date: '2024-11-01',
        customer: { id: 1, lastname: 'Norris' },
      },
    ],
    'hydra:totalItems': 1,
  },
};

describe('customerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCustomers', () => {
    it('fetches customers with pagination', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue(mockCustomersApiResponse);

      const result = await customerService.fetchCustomers(1, 10);

      expect(axiosInstance.get).toHaveBeenCalledWith('/api/customers', {
        params: { page: 1, itemsPerPage: 10 },
      });
      expect(result.data).toHaveLength(2);
      expect(result.totalItems).toBe(25);
    });

    it('uses default limit of 10', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue(mockCustomersApiResponse);

      await customerService.fetchCustomers();

      expect(axiosInstance.get).toHaveBeenCalledWith('/api/customers', {
        params: { page: 1, itemsPerPage: 10 },
      });
    });
  });

  describe('fetchCustomerOrders', () => {
    it('fetches orders for a customer', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue(mockOrdersApiResponse);

      const result = await customerService.fetchCustomerOrders(1);

      expect(axiosInstance.get).toHaveBeenCalledWith('/api/customers/1/orders', {
        params: { page: 1, itemsPerPage: 10 },
      });
      expect(result.customer.id).toBe(1);
      expect(result.orders).toHaveLength(1);
      expect(result.total).toBe(49.99);
    });
  });
});
