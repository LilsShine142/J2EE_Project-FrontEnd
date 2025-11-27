import { axiosInstance } from "../lib/axios/axios";
import { configToken } from "./authService";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface NotificationDTO {
  notificationID: number;
  userID: number;
  userName: string;
  title: string;
  content: string;
  sentDate: string;
  isRead: string;
}

export interface NotificationRequest {
  userID: number;
  title: string;
  content: string;
  isRead?: string;
}

/**
 * Lấy danh sách notifications
 */
export const getNotifications = async (
  token: string | null,
  page: number = 0,
  size: number = 10,
  search?: string
): Promise<{ content: NotificationDTO[]; totalElements: number; totalPages: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (search) params.append('search', search);

  const response = await axiosInstance.get<ApiResponse<{ content: NotificationDTO[]; totalElements: number; totalPages: number }>>(
    `/notifications/getall?${params.toString()}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy danh sách notifications thất bại");
  }

  return response.data.data;
};

/**
 * Lấy chi tiết notification theo ID
 */
export const getNotificationById = async (
  token: string | null,
  id: number
): Promise<NotificationDTO> => {
  const response = await axiosInstance.get<ApiResponse<NotificationDTO>>(
    `/notifications/${id}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy chi tiết notification thất bại");
  }

  return response.data.data;
};

/**
 * Tạo notification mới
 */
export const createNotification = async (
  token: string | null,
  request: NotificationRequest
): Promise<NotificationDTO> => {
  const response = await axiosInstance.post<ApiResponse<NotificationDTO>>(
    `/notifications/create`,
    request,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Tạo notification thất bại");
  }

  return response.data.data;
};

/**
 * Cập nhật notification
 */
export const updateNotification = async (
  token: string | null,
  id: number,
  request: NotificationRequest
): Promise<NotificationDTO> => {
  const response = await axiosInstance.put<ApiResponse<NotificationDTO>>(
    `/notifications/${id}`,
    request,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Cập nhật notification thất bại");
  }

  return response.data.data;
};

/**
 * Xóa notification
 */
export const deleteNotification = async (
  token: string | null,
  id: number
): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/notifications/${id}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Xóa notification thất bại");
  }
};

/**
 * Đánh dấu đã đọc
 */
export const markAsRead = async (
  token: string | null,
  id: number
): Promise<NotificationDTO> => {
  const response = await axiosInstance.put<ApiResponse<NotificationDTO>>(
    `/notifications/${id}/mark-as-read`,
    {},
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Đánh dấu đã đọc thất bại");
  }

  return response.data.data;
};