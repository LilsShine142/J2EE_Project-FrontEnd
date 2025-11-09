import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  getBookingsForCurrentUser,
  cancelBooking,
  deleteBooking,
  updateBooking,
  getBookingById,
  type BookingRequestDTO,
} from '../service/bookingService';
import { message } from 'antd';

export interface Booking {
  bookingId: number;
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

// CẬP NHẬT: useMyBookings nhận thêm options để truyền enabled
type UseMyBookingsOptions = {
  enabled?: boolean;
};

export const useBooking = (token: string | null) => {
  console.log('useBooking received token:', token);
  const queryClient = useQueryClient();

  // 1. LẤY DANH SÁCH ĐẶT BÀN
  const useMyBookings = (
    page: number,
    size = 5,
    options?: UseMyBookingsOptions
  ) => {
    return useQuery<PaginatedBookings, Error>({
      queryKey: ['myBookings', page, size],
      queryFn: async () => {
        console.log('token in useMyBookings:', token);
        const token2 = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwc3U5NTIyOEBnbWFpbC5jb20iLCJpYXQiOjE3NjI0MjQzMDMsImV4cCI6MTc2MjQ2MDMwM30.0XrWiMlizUf2wY8LlMbY3_WzzxWK-116auK-bq7H4EY";
        if (!token) throw new Error('Token không hợp lệ');
        const res = await getBookingsForCurrentUser(token, page, size);
        console.log('Raw API response:', res.content);
        const rawItems = Array.isArray(res?.content) ? res.content : [];
        const items: Booking[] = rawItems.map((b: any) => ({
          bookingId: b.bookingID ?? null,
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
      enabled: (options?.enabled ?? true) && !!token, // CHỜ AUTH + TOKEN
      placeholderData: { items: [], total: 0 },
      retry: 1,
      staleTime: 5 * 60 * 1000,
    });
  };

  // 2. HỦY BOOKING + OPTIMISTIC UPDATE
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
              b.bookingId === bookingID ? { ...b, status: 'Cancelled' } : b
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

  const useGetBooking = (bookingID: number) => {
    return useQuery<Booking, Error>({
      queryKey: ['booking', bookingID],
      queryFn: () => getBookingById(token, bookingID),
      enabled: !!bookingID && !!token,
    });
  };

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

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ bookingId, data }: { bookingId: number; data: BookingRequestDTO }) => {
        if (!token) throw new Error('Token không hợp lệ');
        return updateBooking(token, bookingId, data);
      },
      onSuccess: (updated) => {
        message.success('Cập nhật thành công');
        queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        queryClient.setQueryData(['booking', updated.bookingId], updated);
      },
      onError: (err) => message.error(err.message || 'Cập nhật thất bại'),
    });
  };

  return {
    useMyBookings,
    useGetBooking,
    useCancel,
    useDelete,
    useUpdate,
  };
};