import { axiosInstance } from "../lib/axios/axios";
import { configToken } from "./authService";

// === SHARED TYPES ===
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// === EMAIL DTOs ===
export interface EmailRequest {
  sendType: 'USER' | 'LIST' | 'ROLE';
  userId?: number;
  userIds?: number[];
  roleId?: number;
  title: string;
  content: string;
  templateVariables?: Record<string, any>;
}

export interface EmailVerificationRequest {
  userId: number;
  email: string;
  fullName?: string;
}

export interface PasswordResetRequest {
  userId: number;
  email: string;
}

// === EMAIL HISTORY DTO ===
export interface EmailHistoryDTO {
  id: number;
  userId: number;
  email: string;
  title: string;
  content: string;
  sendType: string;
  sentAt: string;
  status: string;
}

// === EMAIL HISTORY API ===

/**
 * Lấy lịch sử gửi email
 */
export const getEmailHistory = async (
  token: string | null,
  offset: number = 0,
  limit: number = 10,
  userId?: number,
  startDate?: string,
  endDate?: string,
  type?: string
): Promise<{ content: EmailHistoryDTO[]; totalElements: number; totalPages: number }> => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  if (userId) params.append('userId', userId.toString());
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (type) params.append('type', type);

  const response = await axiosInstance.get<ApiResponse<{ content: EmailHistoryDTO[]; totalElements: number; totalPages: number }>>(
    `/emails/history?${params.toString()}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy lịch sử email thất bại");
  }

  return response.data.data;
};

// === EMAIL APIs ===

/**
 * Gửi email linh hoạt
 */
export const sendEmail = async (
  token: string | null,
  request: EmailRequest
): Promise<void> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    '/emails/send',
    request,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Gửi email thất bại");
  }
};

/**
 * Gửi mã xác nhận
 */
export const sendVerificationEmail = async (
  token: string | null,
  request: EmailVerificationRequest
): Promise<void> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    '/emails/send-verification',
    request,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Gửi email xác nhận thất bại");
  }
};

/**
 * Gửi mật khẩu tạm thời
 */
export const sendPasswordResetEmail = async (
  token: string | null,
  request: PasswordResetRequest
): Promise<void> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    '/emails/send-password-reset',
    request,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Gửi email đặt lại mật khẩu thất bại");
  }
};

/**
 * Gửi email chào mừng
 */
export const sendWelcomeEmail = async (
  token: string | null,
  request: EmailVerificationRequest
): Promise<void> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    '/emails/send-welcome',
    request,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Gửi email chào mừng thất bại");
  }
};

/**
 * Lấy chi tiết email theo ID
 */
export const getEmailById = async (
  token: string | null,
  id: number
): Promise<EmailHistoryDTO> => {
  const response = await axiosInstance.get<ApiResponse<EmailHistoryDTO>>(
    `/emails/${id}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy chi tiết email thất bại");
  }

  return response.data.data;
};