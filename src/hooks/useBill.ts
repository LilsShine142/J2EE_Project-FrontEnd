import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { message } from 'antd';
import {
  getAllBills,
  getBillById,
  createBillForOrder,
  createBillForBooking,
  checkoutAtRestaurant,
  updateBill,
  initiatePayment,
  refundBill,
  cancelBillForBooking,
  type BillDTO,
  type PaginatedBills,
  type PaymentDTO,
  type RefundPaymentDTO,
  type BillForBookingRequestDTO,
  type CheckoutAtRestaurantRequest,
} from '../service/billService';

type UseBillsOptions = {
  enabled?: boolean;
};

export const useBill = (token: string | null) => {
  const queryClient = useQueryClient();

  // ===== QUERIES =====

  /**
   * Lấy danh sách bills với phân trang và filter
   */
  const useBills = (
    page: number = 0,
    size: number = 10,
    search?: string,
    statusId?: number,
    userId?: number,
    tableId?: number,
    options?: UseBillsOptions
  ) => {
    return useQuery<PaginatedBills, Error>({
      queryKey: ['bills', page, size, search, statusId, userId, tableId],
      queryFn: () => getAllBills(token, page, size, search, statusId, userId, tableId),
      enabled: options?.enabled ?? true,
      staleTime: 30000, // 30 seconds
    });
  };

  /**
   * Lấy bill theo ID
   */
  const useBillById = (
    billId: number,
    options?: UseQueryOptions<BillDTO, Error>
  ) => {
    return useQuery<BillDTO, Error>({
      queryKey: ['bill', billId],
      queryFn: () => getBillById(token, billId),
      enabled: !!billId && (options?.enabled ?? true),
      staleTime: 30000,
    });
  };

  // ===== MUTATIONS =====

  /**
   * Tạo bill cho order
   */
  const useCreateBillForOrder = () => {
    return useMutation({
      mutationFn: ({ orderId, paymentData }: { orderId: number; paymentData: PaymentDTO }) =>
        createBillForOrder(token, orderId, paymentData),
      onSuccess: (data) => {
        message.success('Tạo hóa đơn cho order thành công!');
        queryClient.invalidateQueries({ queryKey: ['bills'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      onError: (error: any) => {
        message.error(error.message || 'Tạo hóa đơn cho order thất bại!');
      },
    });
  };

  /**
   * Tạo bill cho booking và khởi tạo thanh toán
   */
  const useCreateBillForBooking = () => {
    return useMutation({
      mutationFn: ({ bookingId, requestData }: { bookingId: number; requestData: BillForBookingRequestDTO }) =>
        createBillForBooking(token, bookingId, requestData),
      onSuccess: (paymentUrl) => {
        message.success('Tạo hóa đơn và khởi tạo thanh toán thành công!');
        queryClient.invalidateQueries({ queryKey: ['bills'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        // Redirect to payment URL
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      },
      onError: (error: any) => {
        message.error(error.message || 'Tạo hóa đơn cho booking thất bại!');
      },
    });
  };

  /**
   * Xuất hóa đơn cuối cùng tại quán
   */
  const useCheckoutAtRestaurant = () => {
    return useMutation({
      mutationFn: (requestData: CheckoutAtRestaurantRequest) =>
        checkoutAtRestaurant(token, requestData),
      onSuccess: (data) => {
        message.success('Xuất hóa đơn thành công! Bàn đã được giải phóng.');
        queryClient.invalidateQueries({ queryKey: ['bills'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['tables'] });
      },
      onError: (error: any) => {
        message.error(error.message || 'Xuất hóa đơn thất bại!');
      },
    });
  };

  /**
   * Cập nhật bill
   */
  const useUpdateBill = () => {
    return useMutation({
      mutationFn: ({ billId, billData }: { billId: number; billData: Partial<BillDTO> }) =>
        updateBill(token, billId, billData),
      onSuccess: (data) => {
        message.success('Cập nhật hóa đơn thành công!');
        queryClient.invalidateQueries({ queryKey: ['bills'] });
        queryClient.invalidateQueries({ queryKey: ['bill', data.billID] });
      },
      onError: (error: any) => {
        message.error(error.message || 'Cập nhật hóa đơn thất bại!');
      },
    });
  };

  /**
   * Khởi tạo thanh toán cho bill
   */
  const useInitiatePayment = () => {
    return useMutation({
      mutationFn: ({ billId, paymentData }: { billId: number; paymentData: PaymentDTO }) =>
        initiatePayment(token, billId, paymentData),
      onSuccess: (paymentUrl) => {
        message.success('Tạo URL thanh toán thành công!');
        // Redirect to payment URL
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      },
      onError: (error: any) => {
        message.error(error.message || 'Tạo URL thanh toán thất bại!');
      },
    });
  };

  /**
   * Hoàn tiền cho bill
   */
  const useRefundBill = () => {
    return useMutation({
      mutationFn: ({ billId, refundData }: { billId: number; refundData: RefundPaymentDTO }) =>
        refundBill(token, billId, refundData),
      onSuccess: () => {
        message.success('Hoàn tiền thành công!');
        queryClient.invalidateQueries({ queryKey: ['bills'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
      onError: (error: any) => {
        message.error(error.message || 'Hoàn tiền thất bại!');
      },
    });
  };

  /**
   * Hủy bill cho booking
   */
  const useCancelBillForBooking = () => {
    return useMutation({
      mutationFn: (bookingId: number) => cancelBillForBooking(token, bookingId),
      onSuccess: () => {
        message.success('Hủy hóa đơn thành công!');
        queryClient.invalidateQueries({ queryKey: ['bills'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
      onError: (error: any) => {
        message.error(error.message || 'Hủy hóa đơn thất bại!');
      },
    });
  };

  return {
    // Queries
    useBills,
    useBillById,

    // Mutations
    useCreateBillForOrder,
    useCreateBillForBooking,
    useCheckoutAtRestaurant,
    useUpdateBill,
    useInitiatePayment,
    useRefundBill,
    useCancelBillForBooking,
  };
};