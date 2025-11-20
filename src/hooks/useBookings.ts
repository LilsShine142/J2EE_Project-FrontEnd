import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBookingsForCurrentUser,
  getAllBookings,
  cancelBooking,
  deleteBooking,
  updateBooking,
  getBookingById,
  createBooking,
  type BookingRequestDTO,
  type BookingDTO,
  type PaginatedBookings,
  type CreateBookingDTO,
} from '../service/bookingService';
import { message } from 'antd';
import { getCurrentUser } from '../service/authService';

type UseMyBookingsOptions = {
  enabled?: boolean;
};

export const useBooking = (token: string | null) => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  // 1. LẤY DANH SÁCH ĐẶT BÀN CỦA USER
  const useMyBookings = (
    page: number,
    size = 10,
    options?: UseMyBookingsOptions
  ) => {
    return useQuery<PaginatedBookings, Error>({
      queryKey: ['myBookings', page, size],
      queryFn: async () => {
        if (!token) throw new Error('Token không hợp lệ');
        if (!currentUser?.userId) throw new Error('Không tìm thấy thông tin người dùng');

        return await getBookingsForCurrentUser(token, currentUser.userId, page, size);
      },
      enabled: (options?.enabled ?? true) && !!token && !!currentUser?.userId,
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

  // 2. LẤY TẤT CẢ BOOKINGS (ADMIN)
  const useAllBookings = (
    page: number,
    size = 10,
    statusId?: number,
    search?: string,
    options?: UseMyBookingsOptions,
  ) => {
    return useQuery<PaginatedBookings, Error>({
      queryKey: ['allBookings', page, size, statusId, search],
      queryFn: async () => {
        if (!token) throw new Error('Token không hợp lệ');
        return await getAllBookings(token, page, size, statusId, search);
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

  // 3. TẠO BOOKING MỚI
  const useCreateBooking = () => {
    return useMutation({
      mutationFn: (data: CreateBookingDTO) => {
        if (!token) throw new Error('Token không hợp lệ');
        return createBooking(token, data);
      },
      onSuccess: (newBooking) => {
        message.success('Đặt bàn thành công!');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.invalidateQueries({ queryKey: ['allBookings'] });
        queryClient.setQueryData(['booking', newBooking.bookingID], newBooking);
      },
      onError: (err: any) => {
        message.error(err.message || 'Đặt bàn thất bại');
      },
    });
  };

  // 4. HỦY BOOKING
  const useCancel = () => {
    return useMutation({
      mutationFn: (bookingID: number) => {
        if (!token) throw new Error('Token không hợp lệ');
        return cancelBooking(token, bookingID);
      },
      onSuccess: () => {
        message.success('Hủy đặt bàn thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Hủy thất bại');
      },
    });
  };

  // 5. LẤY BOOKING THEO ID
  const useGetBooking = (bookingID: number) => {
    return useQuery<BookingDTO, Error>({
      queryKey: ['booking', bookingID],
      queryFn: () => {
        if (!token) throw new Error('Token không hợp lệ');
        return getBookingById(token, bookingID);
      },
      enabled: !!bookingID && !!token,
    });
  };

  // 6. XÓA BOOKING
  const useDelete = () => {
    return useMutation({
      mutationFn: (bookingID: number) => {
        if (!token) throw new Error('Token không hợp lệ');
        return deleteBooking(token, bookingID);
      },
      onSuccess: () => {
        message.success('Xóa thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      },
      onError: (err: any) => message.error(err.message || 'Xóa thất bại'),
    });
  };

  // 7. CẬP NHẬT BOOKING
  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ bookingId, data }: { bookingId: number; data: BookingRequestDTO }) => {
        if (!token) throw new Error('Token không hợp lệ');
        return updateBooking(token, bookingId, data);
      },
      onSuccess: (updated) => {
        message.success('Cập nhật thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.invalidateQueries({ queryKey: ['allBookings'] });
        queryClient.setQueryData(['booking', updated.bookingID], updated);
      },
      onError: (err: any) => message.error(err.message || 'Cập nhật thất bại'),
    });
  };

  return {
    useMyBookings,
    useAllBookings, 
    useCreateBooking,
    useGetBooking,
    useCancel,
    useDelete,
    useUpdate,
  };
};