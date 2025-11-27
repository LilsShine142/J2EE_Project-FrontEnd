import { axiosInstance } from '../lib/axios/axios';
import { configToken } from './authService';
import { type User } from '../types/index';
import Cookies from 'js-cookie';

// === Định nghĩa response từ backend ===
export interface PageResponse<T> {
  content: T[];                    // danh sách user trang hiện tại
  totalElements: number;           // tổng số user
  totalPages: number;
  size: number;
  number: number;                  // page hiện tại (0-based)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    users: User[];  
  };
}

export interface UpdateUserResponse {
  status: number;
  success: boolean;
  message: string;
  data: User; 
}

/**
 * Lấy thông tin người dùng theo ID từ API
 */
export const getUserById = async (userId: number): Promise<PageResponse<User>> => {
  const response = await axiosInstance.get<PageResponse<User>>(`/users/${userId}`,
      configToken(Cookies.get('authToken')!)
    );
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
/**
 * Lây danh sách tất cả người dùng
 */
export const getAllUsers = async (
  token: string, 
  roleId?: number,     
  statusId?: number,   
  search?: string,
  page: number = 0, 
  size: number = 10
): Promise<ApiResponse> => {
  try {
    // Tạo params object, chỉ thêm key nếu có giá trị
    const params: any = { 
      offset: page * size, 
      limit: size 
    };
    
    // Chỉ thêm roleId nếu có giá trị
    if (roleId !== undefined && roleId !== null) {
      params.roleId = roleId;
    }
    
    // Chỉ thêm statusId nếu có giá trị
    if (statusId !== undefined && statusId !== null) {
      params.statusId = statusId;
    }

    // Chỉ thêm search nếu có giá trị
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }

    console.log('API params:', params);

    const response = await axiosInstance.get<ApiResponse>('/users/get-all', {
      params,
      ...configToken(token),
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


/**
 * Tạo user mới
 */
export const createUser = async (
  token: string,
  userData: {
    fullName: string;
    phoneNumber: string; 
    email: string;
    address?: string;
    password: string;
    roleId: number;
    statusId: number; 
    statusWork: number; 
  }
): Promise<ApiResponse> => {
  try {
    console.log('📤 Calling API /users/register with:', userData);
    
    const response = await axiosInstance.post<ApiResponse>(
      '/users/register',
      userData,
      configToken(token)
    );

    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('createUser failed:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// === CẬP NHẬT USER ===
export const updateUser = async (
  token: string,
  userId: number,
  userData: Partial<User>  
): Promise<UpdateUserResponse> => {
  const response = await axiosInstance.put<UpdateUserResponse>(
    `/users/${userId}`,
    userData,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Cập nhật thất bại");
  }

  return response.data;
};
