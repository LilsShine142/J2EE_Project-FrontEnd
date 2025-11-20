// import { axiosInstance } from '../lib/axios/axios';
// import { configToken } from './authService';

// export interface Role {
//   roleID: number;
//   roleName: string;
//   description?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface RolePageResponse {
//   content: Role[];
//   totalElements: number;
//   totalPages: number;
//   size: number;
//   number: number;
// }

// export const getAllRoles = async (
//   token: string,
//   search?: string,
//   page: number = 0,
//   size: number = 100
// ): Promise<RolePageResponse> => {
//   try {
//     const params: any = { offset: page * size, limit: size };
//     if (search && search.trim()) {
//       params.search = search.trim();
//     }

//     const response = await axiosInstance.get<{ data: RolePageResponse }>('/roles', {
//       params,
//       ...configToken(token),
//     });

//     return response.data.data;
//   } catch (error: any) {
//     console.error('Error fetching roles:', error);
//     throw new Error(error.response?.data?.message || 'Lấy danh sách vai trò thất bại');
//   }
// };



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

export interface RoleDTO {
  roleID: number;
  roleName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleRequest {
  roleName: string;
  description?: string;
}

export type PaginatedRoles = PageResponse<RoleDTO>;

const API_URL = '/roles';

export const roleService = {
  // Get all roles with pagination
  getAllRoles: async (
    token: string,
    offset: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedRoles> => {
    const params: any = { offset, limit };
    if (search) params.search = search;

    const response = await axiosInstance.get<ApiResponse<PaginatedRoles>>(
      API_URL,
      {
        params,
        ...configToken(token),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy danh sách vai trò');
    }

    return response.data.data;
  },

  // Get role by ID
  getRoleById: async (id: number, token: string): Promise<RoleDTO> => {
    const response = await axiosInstance.get<ApiResponse<RoleDTO>>(
      `${API_URL}/${id}`,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy thông tin vai trò');
    }

    return response.data.data;
  },

  // Create new role
  createRole: async (data: RoleRequest, token: string): Promise<RoleDTO> => {
    const response = await axiosInstance.post<ApiResponse<RoleDTO>>(
      `${API_URL}/create`,
      data,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Tạo vai trò thất bại');
    }

    return response.data.data;
  },

  // Update role
  updateRole: async (id: number, data: RoleRequest, token: string): Promise<RoleDTO> => {
    const response = await axiosInstance.put<ApiResponse<RoleDTO>>(
      `${API_URL}/${id}`,
      data,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Cập nhật vai trò thất bại');
    }

    return response.data.data;
  },

  // Delete role
  deleteRole: async (id: number, token: string): Promise<void> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `${API_URL}/${id}`,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Xóa vai trò thất bại');
    }
  },
};