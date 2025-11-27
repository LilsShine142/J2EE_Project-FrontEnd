import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionService, type PermissionDTO, type PermissionRequest } from '../service/permissionService';
import { message } from 'antd';
import { configToken } from '../service/authService';
import { axiosInstance } from '../lib/axios/axios';

type UsePermissionsOptions = {
  enabled?: boolean;
};

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const usePermission = (token: string) => {
  const queryClient = useQueryClient();

  /**
   * Lấy danh sách permissions của user hiện tại
   */
  const getMyPermissions = async (token: string | null): Promise<PermissionDTO[]> => {
    const response = await axiosInstance.get<ApiResponse<PermissionDTO[]>>(
      '/permissions/my',
      configToken(token)
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Lấy permissions thất bại");
    }

    return response.data.data;
  };

  // Get all permissions
  const usePermissions = (
    page: number,
    size: number = 10,
    search?: string,
    options?: UsePermissionsOptions
  ) => {
    const offset = page * size;
    
    return useQuery({
      queryKey: ['permissions', page, size, search],
      queryFn: () => permissionService.getAllPermissions(token, offset, size, search),
      enabled: (options?.enabled ?? true) && !!token,
      placeholderData: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: 0,
        first: true,
        last: true,
        empty: true,
      },
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });
  };

  // Get permission by ID
  const usePermissionById = (id: number) => {
    return useQuery({
      queryKey: ['permission', id],
      queryFn: () => permissionService.getPermissionById(id, token),
      enabled: !!id && !!token,
    });
  };

  // Create permission
  const useCreatePermission = () => {
    return useMutation({
      mutationFn: (data: PermissionRequest) =>
        permissionService.createPermission(data, token),
      onSuccess: () => {
        message.success('Tạo quyền thành công!');
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Tạo quyền thất bại');
      },
    });
  };

  // Update permission
  const useUpdatePermission = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: PermissionRequest }) =>
        permissionService.updatePermission(id, data, token),
      onSuccess: () => {
        message.success('Cập nhật quyền thành công!');
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
        queryClient.invalidateQueries({ queryKey: ['permission'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Cập nhật quyền thất bại');
      },
    });
  };

  // Delete permission
  const useDeletePermission = () => {
    return useMutation({
      mutationFn: (id: number) => permissionService.deletePermission(id, token),
      onSuccess: () => {
        message.success('Xóa quyền thành công!');
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Xóa quyền thất bại');
      },
    });
  };

  return {
    usePermissions,
    usePermissionById,
    useCreatePermission,
    useUpdatePermission,
    useDeletePermission,
    getMyPermissions,
  };
};