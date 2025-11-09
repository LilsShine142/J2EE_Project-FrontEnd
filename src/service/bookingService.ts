import { axiosInstance } from "../lib/axios/axios";
import { getCurrentUser } from "./authService";

// === Request & Response DTOs ===
export interface BookingRequestDTO {
  tableId: number;
  bookingDate: string; // ISO: "2025-04-05T18:00:00"
  numberOfGuests: number;
  specialRequests?: string;
}

export interface BookingDTO {
  bookingId: number;
  userId: number;
  tableId: number;
  tableName: string;
  bookingDate: string;
  startTime: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userFullName: string;
  userPhone: string;
  initialPayment?: number;
}

export interface PageResponse<T> {
  content: T[];
  total: number;
  offset: number;
  limit: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// === Helper: Lấy token an toàn từ cookie ===
const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )authToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// === Helper: Tạo config với token (dùng chung) ===
const configToken = (token: string | null) => {
  console.log('Configuring token for request:', token);
  if (!token) {
    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
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
export const getBookingsForCurrentUser = async (
  token: string | null,
  page = 0,
  size = 10
): Promise<PageResponse<BookingDTO>> => {
  const currentUser = getCurrentUser();
  if (!currentUser?.userId) {
    throw new Error("Bạn cần đăng nhập để xem đặt bàn");
  }
  console.log('Getting bookings for user ID:', currentUser.userId);
  console.log('Using token:', token);
  const response = await axiosInstance.get<ApiResponse<PageResponse<BookingDTO>>>(
    `/bookings/user/12`, // Tạm thời gắn cứng id user
    {
      params: { offset: page * size, limit: size },
      ...configToken(token),
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Không thể tải danh sách đặt bàn");
  }

  return response.data.data;
};

// === KIỂM TRA CHỦ SỞ HỮU ===
export const isBookingOwner = (booking: BookingDTO): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.userId === booking.userId;
};