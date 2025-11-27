import { axiosInstance } from "../lib/axios/axios";
import { configToken } from "./authService";
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LogDTO {
  logID: number;
  tableName: string;
  recordID: number;
  action: string;
  changeTime: string;
  changeDetails: string;
  userID: number | null;
  userName: string | null;
}

/**
 * Lấy danh sách logs
 */
export const getLogs = async (
  token: string | null,
  offset: number = 0,
  limit: number = 10,
  search?: string
): Promise<{ content: LogDTO[]; totalElements: number; totalPages: number }> => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);

  const response = await axiosInstance.get<ApiResponse<{ content: LogDTO[]; totalElements: number; totalPages: number }>>(
    `/logs/getall?${params.toString()}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy danh sách logs thất bại");
  }

  return response.data.data;
};