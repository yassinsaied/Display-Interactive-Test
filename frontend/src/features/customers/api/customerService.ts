import axiosInstance from '@/shared/lib/axios';
import type { HydraCollection, PaginatedResponse } from '@/shared/types';
import type { Customer, CustomerOrdersResponse, CustomerSummary, Order } from '../types';

const DEFAULT_LIMIT = 10;

export const customerService = {
  async fetchCustomers(
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
    search?: string
  ): Promise<PaginatedResponse<Customer>> {
    const params: Record<string, unknown> = { page, itemsPerPage: limit };
    if (search) params.search = search;

    const response = await axiosInstance.get<HydraCollection<Customer>>('/api/customers', {
      params,
    });

    const { 'hydra:member': data, 'hydra:totalItems': totalItems } = response.data;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalItems,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  },

  async fetchCustomerOrders(
    customerId: number,
    page: number = 1,
    limit: number = DEFAULT_LIMIT,
    search?: string
  ): Promise<CustomerOrdersResponse> {
    const url = `/api/customers/${customerId}/orders`;
    const params: Record<string, unknown> = { page, itemsPerPage: limit };
    if (search) params.search = search;

    type RawOrder = Order & { customer: CustomerSummary };
    const response = await axiosInstance.get<HydraCollection<RawOrder>>(url, { params });
    const rawOrders = response.data['hydra:member'];
    const totalItems = response.data['hydra:totalItems'] ?? rawOrders.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const customer: CustomerSummary = rawOrders[0]?.customer ?? { id: customerId, lastname: null };
    const total = rawOrders.reduce((sum, o) => sum + o.price, 0);
    const orders: Order[] = rawOrders.map(o => ({
      id: o.id,
      purchaseIdentifier: o.purchaseIdentifier,
      productId: o.productId,
      quantity: o.quantity,
      price: o.price,
      currency: o.currency,
      date: o.date,
    }));

    return {
      customer,
      orders,
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalItems,
    };
  },
};

export default customerService;

