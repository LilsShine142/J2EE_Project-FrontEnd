import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  type OrderDTO,
  type OrderRequestDTO,
  type PaginatedOrders,
} from '../service/orderService';
import { message } from 'antd';

type UseOrdersOptions = {
  enabled?: boolean;
};

export const useOrder = (token: string | null) => {
  const queryClient = useQueryClient();

  // 1. LẤY TẤT CẢ ORDERS
  const useAllOrders = (
    page: number,
    size = 10,
    search?: string,
    statusId?: number,
    userId?: number,
    tableId?: number,
    options?: UseOrdersOptions
  ) => {
    return useQuery<PaginatedOrders, Error>({
      queryKey: ['allOrders', page, size, search, statusId, userId, tableId],
      queryFn: async () => {
        if (!token) throw new Error('Token không hợp lệ');
        return await getAllOrders(token, page, size, search, statusId, userId, tableId);
      },
      enabled: (options?.enabled ?? true) && !!token,
      placeholderData: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: 0,
        first: true,
        last: true,
        empty: true,
      },
      retry: 1,
      staleTime: 5 * 60 * 1000,
    });
  };

  // 2. TẠO ORDER MỚI
  const useCreateOrder = () => {
    return useMutation({
      mutationFn: (data: OrderRequestDTO) => {
        if (!token) throw new Error('Token không hợp lệ');
        return createOrder(token, data);
      },
      onSuccess: (newOrder) => {
        message.success('Tạo đơn hàng thành công!');
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        queryClient.setQueryData(['order', newOrder.orderID], newOrder);
      },
      onError: (err: any) => {
        message.error(err.message || 'Tạo đơn hàng thất bại');
      },
    });
  };

  // 3. LẤY ORDER THEO ID
  const useGetOrder = (orderId: number) => {
    return useQuery<OrderDTO, Error>({
      queryKey: ['order', orderId],
      queryFn: () => {
        if (!token) throw new Error('Token không hợp lệ');
        return getOrderById(token, orderId);
      },
      enabled: !!orderId && !!token,
    });
  };

  // 4. CẬP NHẬT ORDER
  const useUpdateOrder = () => {
    return useMutation({
      mutationFn: ({ orderId, data }: { orderId: number; data: OrderRequestDTO }) => {
        if (!token) throw new Error('Token không hợp lệ');
        return updateOrder(token, orderId, data);
      },
      onSuccess: (updated) => {
        message.success('Cập nhật đơn hàng thành công');
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
        queryClient.setQueryData(['order', updated.orderID], updated);
      },
      onError: (err: any) => message.error(err.message || 'Cập nhật thất bại'),
    });
  };

  // 5. XÓA ORDER
  const useDeleteOrder = () => {
    return useMutation({
      mutationFn: (orderId: number) => {
        if (!token) throw new Error('Token không hợp lệ');
        return deleteOrder(token, orderId);
      },
      onSuccess: () => {
        message.success('Hủy đơn hàng thành công');
        queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      },
      onError: (err: any) => message.error(err.message || 'Hủy thất bại'),
    });
  };

  return {
    useAllOrders,
    useCreateOrder,
    useGetOrder,
    useUpdateOrder,
    useDeleteOrder,
  };
};