import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBookingsForCurrentUser,
  cancelBooking,
  deleteBooking,
  updateBooking,
  getBookingById,
  createBooking, 
  type BookingRequestDTO,
} from '../service/bookingService';
import { message } from 'antd';
import { getCurrentUser } from '../service/authService';

export interface Booking {
  bookingID: number;
  tableName: string;
  bookingDate: string;
  startTime: string;
  numberOfGuests: number;
  initialPayment?: number;
  status: string;
  userFullName?: string;
  userPhone?: string;
}

export interface PaginatedBookings {
  items: Booking[];
  total: number;
}

type UseMyBookingsOptions = {
  enabled?: boolean;
};

export const useBooking = (token: string | null) => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  // 1. LẤY DANH SÁCH ĐẶT BÀN CỦA USER (SỬA LỖI ID 12)
  const useMyBookings = (
    page: number,
    size = 5,
    options?: UseMyBookingsOptions
  ) => {
    return useQuery<PaginatedBookings, Error>({
      queryKey: ['myBookings', page, size],
      queryFn: async () => {
        if (!token) throw new Error('Token không hợp lệ');
        if (!currentUser?.userId) throw new Error('Không tìm thấy thông tin người dùng');

        const res = await getBookingsForCurrentUser(token, currentUser.userId, page, size);
        const rawItems = Array.isArray(res?.content) ? res.content : [];

        const items: Booking[] = rawItems.map((b: any) => ({
          bookingID: b.bookingID ?? null,
          tableName: b.tableName ?? 'Không rõ',
          bookingDate: b.bookingDate ?? '',
          startTime: b.startTime ?? '',
          numberOfGuests: b.numberOfGuests ?? 0,
          initialPayment: b.initialPayment,
          status: b.status ?? 'Unknown',
          userFullName: b.userFullName ?? '',
          userPhone: b.userPhone ?? '',
        }));

        return {
          items,
          total: res?.total ?? 0,
        };
      },
      enabled: (options?.enabled ?? true) && !!token && !!currentUser?.userId,
      placeholderData: { items: [], total: 0 },
      retry: 1,
      staleTime: 5 * 60 * 1000,
    });
  };

  // 2. TẠO BOOKING MỚI (MỚI)
  const useCreateBooking = () => {
    return useMutation({
      mutationFn: (data: {
        userID: number;
        tableID: number;
        bookingDate: string;
        startTime: string;
        endTime: string;
        numberOfGuests: number;
        notes?: string;
        initialPayment?: number;
        paymentMethod?: string;
        meals?: Array<{ mealID: number; quantity: number }>;
      }) => {
        if (!token) throw new Error('Token không hợp lệ');
        return createBooking(token, data);
      },
      onSuccess: (newBooking) => {
        message.success('Đặt bàn thành công!');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.setQueryData(['booking', newBooking.bookingID], newBooking);
      },
      onError: (err: any) => {
        message.error(err.message || 'Đặt bàn thất bại');
      },
    });
  };

  // 3. HỦY BOOKING + OPTIMISTIC
  const useCancel = () => {
    return useMutation({
      mutationFn: (bookingID: number) => {
        if (!token) throw new Error('Token không hợp lệ');
        return cancelBooking(token, bookingID);
      },
      onMutate: async (bookingID) => {
        await queryClient.cancelQueries({ queryKey: ['myBookings'] });
        const previous = queryClient.getQueryData<PaginatedBookings>(['myBookings', 0, 5]);

        queryClient.setQueryData(['myBookings', 0, 5], (old: PaginatedBookings | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((b) =>
              b.bookingID === bookingID ? { ...b, status: 'Cancelled' } : b
            ),
          };
        });

        return { previous };
      },
      onError: (err, _, context: any) => {
        queryClient.setQueryData(['myBookings', 0, 5], context.previous);
        message.error(err.message || 'Hủy thất bại');
      },
      onSuccess: () => {
        message.success('Hủy thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      },
    });
  };

  // 4. LẤY BOOKING THEO ID
  const useGetBooking = (bookingID: number) => {
    return useQuery<Booking, Error>({
      queryKey: ['booking', bookingID],
      queryFn: () => getBookingById(token, bookingID),
      enabled: !!bookingID && !!token,
    });
  };

  // 5. XÓA BOOKING
  const useDelete = () => {
    return useMutation({
      mutationFn: (bookingID: number) => {
        if (!token) throw new Error('Token không hợp lệ');
        return deleteBooking(token, bookingID);
      },
      onSuccess: () => {
        message.success('Xóa thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      },
      onError: (err) => message.error(err.message || 'Xóa thất bại'),
    });
  };

  // 6. CẬP NHẬT BOOKING
  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ bookingId, data }: { bookingId: number; data: BookingRequestDTO }) => {
        if (!token) throw new Error('Token không hợp lệ');
        return updateBooking(token, bookingId, data);
      },
      onSuccess: (updated) => {
        message.success('Cập nhật thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.setQueryData(['booking', updated.bookingID], updated);
      },
      onError: (err) => message.error(err.message || 'Cập nhật thất bại'),
    });
  };

  return {
    useMyBookings,
    useCreateBooking, // MỚI
    useGetBooking,
    useCancel,
    useDelete,
    useUpdate,
  };
};