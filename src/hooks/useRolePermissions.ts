import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolePermissionService, type RolePermissionRequest } from '../service/rolePermissionService';
import { message } from 'antd';

type UseRolePermissionsOptions = {
  enabled?: boolean;
};

export const useRolePermission = (token: string) => {
  const queryClient = useQueryClient();

  // Get all role-permissions
  const useRolePermissions = (
    page: number,
    size: number = 10,
    search?: string,
    options?: UseRolePermissionsOptions
  ) => {
    const offset = page * size;
    
    return useQuery({
      queryKey: ['rolePermissions', page, size, search],
      queryFn: () => rolePermissionService.getAllRolePermissions(token, offset, size, search),
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

  // Get permissions by role ID
  const usePermissionsByRoleId = (roleId: number) => {
    return useQuery({
      queryKey: ['rolePermissions', 'byRole', roleId],
      queryFn: () => rolePermissionService.getPermissionsByRoleId(roleId, token),
      enabled: !!roleId && !!token,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get role-permission by composite ID
  const useRolePermissionById = (roleId: number, permissionId: number) => {
    return useQuery({
      queryKey: ['rolePermission', roleId, permissionId],
      queryFn: () => rolePermissionService.getRolePermissionById(roleId, permissionId, token),
      enabled: !!roleId && !!permissionId && !!token,
    });
  };

  // Create role-permission
  const useCreateRolePermission = () => {
    return useMutation({
      mutationFn: (data: RolePermissionRequest) =>
        rolePermissionService.createRolePermission(data, token),
      onSuccess: () => {
        message.success('Gán quyền thành công!');
        queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Gán quyền thất bại');
      },
    });
  };

  // Update role-permission
  const useUpdateRolePermission = () => {
    return useMutation({
      mutationFn: ({ 
        roleId, 
        permissionId, 
        data 
      }: { 
        roleId: number; 
        permissionId: number; 
        data: RolePermissionRequest;
      }) =>
        rolePermissionService.updateRolePermission(roleId, permissionId, data, token),
      onSuccess: () => {
        message.success('Cập nhật phân quyền thành công!');
        queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
        queryClient.invalidateQueries({ queryKey: ['rolePermission'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Cập nhật phân quyền thất bại');
      },
    });
  };

  // Delete role-permission
  const useDeleteRolePermission = () => {
    return useMutation({
      mutationFn: ({ roleId, permissionId }: { roleId: number; permissionId: number }) =>
        rolePermissionService.deleteRolePermission(roleId, permissionId, token),
      onSuccess: () => {
        message.success('Xóa phân quyền thành công!');
        queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Xóa phân quyền thất bại');
      },
    });
  };

  // Batch assign permissions to role
  const useBatchAssignPermissions = () => {
    return useMutation({
      mutationFn: ({
        roleId,
        permissionIds,
        grantedByUserId,
      }: {
        roleId: number;
        permissionIds: number[];
        grantedByUserId: number;
      }) =>
        rolePermissionService.batchAssignPermissions(
          roleId,
          permissionIds,
          grantedByUserId,
          token
        ),
      onSuccess: () => {
        message.success('Gán quyền hàng loạt thành công!');
        queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Gán quyền hàng loạt thất bại');
      },
    });
  };

  // Batch remove permissions from role
  const useBatchRemovePermissions = () => {
    return useMutation({
      mutationFn: ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) =>
        rolePermissionService.batchRemovePermissions(roleId, permissionIds, token),
      onSuccess: () => {
        message.success('Xóa quyền hàng loạt thành công!');
        queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Xóa quyền hàng loạt thất bại');
      },
    });
  };

  return {
    useRolePermissions,
    usePermissionsByRoleId,
    useRolePermissionById,
    useCreateRolePermission,
    useUpdateRolePermission,
    useDeleteRolePermission,
    useBatchAssignPermissions,
    useBatchRemovePermissions,
  };
};