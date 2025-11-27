import { axiosInstance } from '../lib/axios/axios';
import { getAuthToken } from './authService';

export interface VNPayParams {
  vnp_Amount?: string;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo?: string;
  vnp_PayDate?: string;
  vnp_ResponseCode?: string;
  vnp_TmnCode?: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string;
  vnp_TxnRef?: string;
  vnp_SecureHash?: string;
}

export interface PaymentResult {
  status: number;
  success: boolean;
  message: string;
  data: {
    billID: number;
    userID: number;
    userName: string;
    tableID: number;
    tableName: string;
    bookingID: number;
    orderID: number | null;
    billDate: string;
    initialPayment: number;
    totalAmount: number;
    remainingAmount: number;
    paymentMethod: string;
    paymentTime: string | null;
    statusID: number;
    statusName: string | null;
    statusDescription: string | null;
    transactionNo: string | null;
    createdAt: string;
    updatedAt: string;
    mealTotal: number | null;
    voucherCode: string | null;
    voucherDescription: string | null;
    discountAmount: number | null;
  };
}

/**
 * Verify VNPAY payment result from URL parameters
 */
export const verifyVNPAYPayment = async (params: any): Promise<PaymentResult> => { // Add return type if not present
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axiosInstance.post<PaymentResult>('/payment/verify', params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error verifying VNPAY payment:', error);
    throw error;
  }
};

/**
 * Get payment result by transaction reference
 */
export const getPaymentByTxnRef = async (txnRef: string): Promise<PaymentResult> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axiosInstance.get<PaymentResult>(`/payment/result/${txnRef}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error getting payment result:', error);
    throw error;
  }
};
