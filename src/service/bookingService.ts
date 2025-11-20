import { axiosInstance } from "../lib/axios/axios";
import { getCurrentUser, configToken } from "./authService";

// === Request & Response DTOs ===
export interface BookingRequestDTO {
  tableID: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  notes?: string;
  initialPayment?: number;
  paymentMethod?: string;
}

export interface BookingDetailDTO {
  id: number | null;
  bookingID: number;
  mealID: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDTO {
  bookingID: number;
  userID: number;
  userName: string | null;
  tableID: number;
  tableName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  statusId: number;
  notes: string;
  numberOfGuests: number;
  initialPayment: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  paymentTime: string | null;
  bookingDetails: BookingDetailDTO[];
}

export interface PaginatedBookings {
  content: BookingDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateBookingDTO {
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
}

// === TẠO BOOKING MỚI ===
export const createBooking = async (
  token: string | null, 
  data: CreateBookingDTO
): Promise<BookingDTO> => {
  const response = await axiosInstance.post<ApiResponse<BookingDTO>>(
    '/bookings/reserve',
    data,
    configToken(token)
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// === LẤY BOOKING THEO ID ===
export const getBookingById = async (token: string | null, bookingID: number): Promise<BookingDTO> => {
  const response = await axiosInstance.get<ApiResponse<BookingDTO>>(
    `/bookings/${bookingID}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Không thể lấy thông tin đặt bàn");
  }

  return response.data.data;
};

// === CẬP NHẬT BOOKING ===
export const updateBooking = async (
  token: string | null,
  bookingId: number,
  data: BookingRequestDTO
): Promise<BookingDTO> => {
  const response = await axiosInstance.put<ApiResponse<BookingDTO>>(
    `/bookings/${bookingId}`,
    data,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Cập nhật thất bại");
  }

  return response.data.data;
};

// === HỦY BOOKING ===
export const cancelBooking = async (token: string | null, bookingId: number): Promise<{ message: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
    `/bookings/cancel/${bookingId}`,
    {},
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Hủy đặt bàn thất bại");
  }

  return response.data.data;
};

// === XÓA BOOKING ===
export const deleteBooking = async (token: string | null, bookingId: number): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/bookings/${bookingId}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Xóa đặt bàn thất bại");
  }
};

// === LẤY DANH SÁCH BOOKING CỦA USER ===
// export const getBookingsForCurrentUser = async (
//   token: string | null,
//   page = 0,
//   size = 10
// ): Promise<PageResponse<BookingDTO>> => {
//   const currentUser = getCurrentUser();
//   if (!currentUser?.userId) {
//     throw new Error("Bạn cần đăng nhập để xem đặt bàn");
//   }
//   console.log('Getting bookings for user ID:', currentUser.userId);
//   console.log('Using token:', token);
//   const response = await axiosInstance.get<ApiResponse<PageResponse<BookingDTO>>>(
//     `/bookings/user/12`, // Tạm thời gắn cứng id user
//     {
//       params: { offset: page * size, limit: size },
//       ...configToken(token),
//     }
//   );

//   if (!response.data.success) {
//     throw new Error(response.data.message || "Không thể tải danh sách đặt bàn");
//   }

//   return response.data.data;
// };
export const getBookingsForCurrentUser = async (
  token: string | null,
  userId: number,
  page = 0,
  size = 10
): Promise<PaginatedBookings> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedBookings>>(
    `/bookings/user/${userId}`,
    {
      params: { offset: page * size, limit: size },
      ...configToken(token),
    }
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// === LẤY TẤT CẢ BOOKINGS (ADMIN) ===
export const getAllBookings = async (
  token: string | null,
  page = 0,
  size = 10,
  statusId?: number,
  search?: string
): Promise<PaginatedBookings> => {
  const params: any = { offset: page * size, limit: size };
  if (statusId !== undefined) params.statusId = statusId;
  if (search !== undefined) params.search = search;

  const response = await axiosInstance.get<ApiResponse<PaginatedBookings>>(
    '/bookings/getall',
    {
      params,
      ...configToken(token),
    }
  );
  
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// === KIỂM TRA CHỦ SỞ HỮU ===
export const isBookingOwner = (booking: BookingDTO): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.userId === booking.userID;
};