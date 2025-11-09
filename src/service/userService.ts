import { axiosInstance } from '../lib/axios/axios';
import { type User } from './authService';

// === Định nghĩa response từ backend ===
export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

/**
 * Lấy thông tin người dùng theo ID từ API
 */
export const getUserById = async (userId: number): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>(`/users/${userId}`);
    console.log("Fetched user by ID:", response.data);
  return response.data;
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUserProfile = async (
  userId: number,
  data: Partial<User>
): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${userId}`, data);
  return response.data;
};