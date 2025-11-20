import { type BillDTO, type PaymentDTO, type CheckoutAtRestaurantRequest } from "../service/billService";

export type { BillDTO, PaymentDTO, CheckoutAtRestaurantRequest };

export interface BillFormData {
  bookingId?: number;
  orderId?: number;
  paymentPercentage: number;
  voucherCode?: string;
  orderInfo: string;
  paymentMethod: string;
}

export interface BillFilterParams {
  search?: string;
  statusId?: number;
  userId?: number;
  tableId?: number;
}

export const BillPaymentMethod = {
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
} as const;

export type BillPaymentMethod = typeof BillPaymentMethod[keyof typeof BillPaymentMethod];

export const BillPaymentPercentage = {
  PARTIAL: 30,
  FULL: 100,
} as const;

export type BillPaymentPercentage = typeof BillPaymentPercentage[keyof typeof BillPaymentPercentage];