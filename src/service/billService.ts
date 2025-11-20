import { axiosInstance } from "../lib/axios/axios";
import { configToken } from "./authService";

// === SHARED TYPES ===
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// === BILL DTOs ===
export interface BillDTO {
  billID: number;
  userID: number | null;
  userName: string | null;
  tableID: number | null;
  tableName: string | null;
  bookingID: number | null;
  orderID: number | null;
  billDate: string;
  mealTotal?: number;
  initialPayment: number;
  totalAmount: number;
  remainingAmount: number;
  paymentMethod: string;
  paymentTime: string | null;
  statusID: number | null;
  statusName?: string;
  statusDescription?: string;
  transactionNo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDTO {
  billID?: string;
  amount: number;
  orderInfo: string;
  paymentMethod: string;
}

export interface RefundPaymentDTO {
  billID: string;
  amount: number;
  reason: string;
  transactionType: string; // "02" (toàn bộ) hoặc "03" (một phần)
  paymentTime?: string;
  transactionNo?: string;
}

export interface BillForBookingRequestDTO {
  bookingId?: number;
  initialPayment?: number;
  paymentPercentage: number;
  voucherCode?: string;
  orderInfo: string;
}

export interface CheckoutAtRestaurantRequest {
  bookingId: number;
  paymentPercentage: number;
  voucherCode?: string;
  orderInfo?: string;
}

export type PaginatedBills = PageResponse<BillDTO>;

// === BILL APIs ===

/**
 * Lấy thông tin chi tiết của một hóa đơn theo ID
 */
export const getBillById = async (
  token: string | null,
  billId: number
): Promise<BillDTO> => {
  const response = await axiosInstance.get<ApiResponse<BillDTO>>(
    `/bill/${billId}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Không thể lấy thông tin hóa đơn");
  }

  return response.data.data;
};

/**
 * Lấy danh sách hóa đơn với phân trang và lọc
 */
export const getAllBills = async (
  token: string | null,
  page = 0,
  size = 10,
  search?: string,
  statusId?: number,
  userId?: number,
  tableId?: number
): Promise<PaginatedBills> => {
  const params: any = { offset: page * size, limit: size };
  if (search) params.search = search;
  if (statusId !== undefined) params.statusId = statusId;
  if (userId !== undefined) params.userId = userId;
  if (tableId !== undefined) params.tableId = tableId;

  const response = await axiosInstance.get<ApiResponse<PaginatedBills>>(
    '/bill',
    {
      params,
      ...configToken(token),
    }
  );

  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

/**
 * Khởi tạo thanh toán cho hóa đơn (tạo URL VNPAY)
 */
export const initiatePayment = async (
  token: string | null,
  billId: number,
  paymentData: PaymentDTO
): Promise<string> => {
  const response = await axiosInstance.post<ApiResponse<string>>(
    `/bill/${billId}/pay`,
    paymentData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Không thể tạo URL thanh toán");
  }

  return response.data.data;
};

/**
 * Yêu cầu hoàn tiền cho hóa đơn
 */
export const refundBill = async (
  token: string | null,
  billId: number,
  refundData: RefundPaymentDTO
): Promise<any> => {
  const response = await axiosInstance.post<ApiResponse<any>>(
    `/bill/${billId}/refund`,
    refundData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Hoàn tiền thất bại");
  }

  return response.data.data;
};

/**
 * Cập nhật thông tin hóa đơn
 */
export const updateBill = async (
  token: string | null,
  billId: number,
  billData: Partial<BillDTO>
): Promise<BillDTO> => {
  const response = await axiosInstance.put<ApiResponse<BillDTO>>(
    `/bill/${billId}`,
    billData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Cập nhật hóa đơn thất bại");
  }

  return response.data.data;
};

/**
 * Tạo hóa đơn cho một Booking và khởi tạo thanh toán
 */
export const createBillForBooking = async (
  token: string | null,
  bookingId: number,
  requestData: BillForBookingRequestDTO
): Promise<string> => {
  const response = await axiosInstance.post<ApiResponse<string>>(
    `/bill/for-booking/${bookingId}`,
    requestData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Tạo hóa đơn cho booking thất bại");
  }

  return response.data.data;
};

/**
 * Tạo hóa đơn cho một Order
 */
export const createBillForOrder = async (
  token: string | null,
  orderId: number,
  paymentData: PaymentDTO
): Promise<BillDTO> => {
  const response = await axiosInstance.post<ApiResponse<BillDTO>>(
    `/bill/for-order/${orderId}`,
    paymentData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Tạo hóa đơn cho order thất bại");
  }

  return response.data.data;
};

/**
 * XUẤT HÓA ĐƠN CUỐI CÙNG TẠI QUÁN (từ Order)
 * → Nhân viên bấm "Xuất hóa đơn" → hoàn tất Order + Booking + giải phóng bàn
 */
export const checkoutAtRestaurant = async (
  token: string | null,
  requestData: CheckoutAtRestaurantRequest
): Promise<BillDTO> => {
  const response = await axiosInstance.post<ApiResponse<BillDTO>>(
    '/bill/checkout-at-restaurant',
    requestData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Xuất hóa đơn thất bại");
  }

  return response.data.data;
};

/**
 * Hủy bill cho booking (có hoàn tiền nếu trong 2h)
 */
export const cancelBillForBooking = async (
  token: string | null,
  bookingId: number
): Promise<any> => {
  const response = await axiosInstance.post<ApiResponse<any>>(
    `/bill/cancel-booking/${bookingId}`,
    {},
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Hủy hóa đơn thất bại");
  }

  return response.data.data;
};