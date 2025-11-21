import { axiosInstance } from '../lib/axios/axios';
import { configToken } from './authService';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PermissionDTO {
  permissionID: number;
  permissionName: string;
  description?: string;
}

export interface PermissionRequest {
  permissionName: string;
  description?: string;
}

export type PaginatedPermissions = PageResponse<PermissionDTO>;

const API_URL = '/permissions';

export const permissionService = {
  // Get all permissions with pagination
  getAllPermissions: async (
    token: string,
    offset: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedPermissions> => {
    const params: any = { offset, limit };
    if (search) params.search = search;

    const response = await axiosInstance.get<ApiResponse<PaginatedPermissions>>(
      API_URL,
      {
        params,
        ...configToken(token),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy danh sách quyền');
    }

    return response.data.data;
  },

  // Get permission by ID
  getPermissionById: async (id: number, token: string): Promise<PermissionDTO> => {
    const response = await axiosInstance.get<ApiResponse<PermissionDTO>>(
      `${API_URL}/${id}`,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy thông tin quyền');
    }

    return response.data.data;
  },

  // Create new permission
  createPermission: async (data: PermissionRequest, token: string): Promise<PermissionDTO> => {
    const response = await axiosInstance.post<ApiResponse<PermissionDTO>>(
      `${API_URL}/create`,
      data,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Tạo quyền thất bại');
    }

    return response.data.data;
  },

  // Update permission
  updatePermission: async (
    id: number,
    data: PermissionRequest,
    token: string
  ): Promise<PermissionDTO> => {
    const response = await axiosInstance.put<ApiResponse<PermissionDTO>>(
      `${API_URL}/${id}`,
      data,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Cập nhật quyền thất bại');
    }

    return response.data.data;
  },

  // Delete permission
  deletePermission: async (id: number, token: string): Promise<void> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `${API_URL}/${id}`,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Xóa quyền thất bại');
    }
  },
};