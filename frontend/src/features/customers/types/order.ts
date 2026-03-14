import type { CustomerSummary } from './customer';

export interface Order {
  id: number;
  purchaseIdentifier: string;
  productId: number;
  quantity: number;
  price: number;
  currency: string;
  date: string;
}

export interface CustomerOrdersResponse {
  customer: CustomerSummary;
  orders: Order[];
  total: number;
  totalItems: number;
}
