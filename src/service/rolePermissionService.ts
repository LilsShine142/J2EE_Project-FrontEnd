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

export interface RolePermissionDTO {
  roleId: number;
  roleName: string;
  permissionId: number;
  permissionName: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionRequest {
  roleId: number;
  permissionId: number;
  grantedByUserId: number;
}

export type PaginatedRolePermissions = PageResponse<RolePermissionDTO>;

const API_URL = '/rolepermissions';

export const rolePermissionService = {
  // Get all role-permissions with pagination
  getAllRolePermissions: async (
    token: string,
    offset: number = 0,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedRolePermissions> => {
    const params: any = { offset, limit };
    if (search) params.search = search;

    const response = await axiosInstance.get<ApiResponse<PaginatedRolePermissions>>(
      API_URL,
      {
        params,
        ...configToken(token),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy danh sách phân quyền');
    }

    return response.data.data;
  },

  // Get permissions by role ID
  getPermissionsByRoleId: async (roleId: number, token: string): Promise<RolePermissionDTO[]> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedRolePermissions>>(
      API_URL,
      {
        params: { offset: 0, limit: 1000 },
        ...configToken(token),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy danh sách quyền');
    }

    return response.data.data.content.filter((rp) => rp.roleId === roleId);
  },

  // Get role-permission by composite ID
  getRolePermissionById: async (
    roleId: number,
    permissionId: number,
    token: string
  ): Promise<RolePermissionDTO> => {
    const response = await axiosInstance.get<ApiResponse<RolePermissionDTO>>(
      `${API_URL}/${roleId}/${permissionId}`,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể lấy thông tin phân quyền');
    }

    return response.data.data;
  },

  // Create new role-permission
  createRolePermission: async (
    data: RolePermissionRequest,
    token: string
  ): Promise<RolePermissionDTO> => {
    const response = await axiosInstance.post<ApiResponse<RolePermissionDTO>>(
      `${API_URL}/create`,
      data,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Gán quyền thất bại');
    }

    return response.data.data;
  },

  // Update role-permission
  updateRolePermission: async (
    roleId: number,
    permissionId: number,
    data: RolePermissionRequest,
    token: string
  ): Promise<RolePermissionDTO> => {
    const response = await axiosInstance.put<ApiResponse<RolePermissionDTO>>(
      `${API_URL}/${roleId}/${permissionId}`,
      data,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Cập nhật phân quyền thất bại');
    }

    return response.data.data;
  },

  // Delete role-permission
  deleteRolePermission: async (
    roleId: number,
    permissionId: number,
    token: string
  ): Promise<void> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `${API_URL}/${roleId}/${permissionId}`,
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Xóa phân quyền thất bại');
    }
  },

  // Batch assign permissions to role
  batchAssignPermissions: async (
    roleId: number,
    permissionIds: number[],
    grantedByUserId: number,
    token: string
  ): Promise<RolePermissionDTO[]> => {
    const promises = permissionIds.map((permissionId) =>
      rolePermissionService.createRolePermission(
        { roleId, permissionId, grantedByUserId },
        token
      )
    );
    return Promise.all(promises);
  },

  // Batch remove permissions from role
  batchRemovePermissions: async (
    roleId: number,
    permissionIds: number[],
    token: string
  ): Promise<void[]> => {
    const promises = permissionIds.map((permissionId) =>
      rolePermissionService.deleteRolePermission(roleId, permissionId, token)
    );
    return Promise.all(promises);
  },
};