// import { useQuery } from '@tanstack/react-query';
// import { getAllRoles, type Role } from '../service/roleService';

// export const useGetAllRoles = (token: string, search?: string) => {
//   return useQuery<Role[], Error>({
//     queryKey: ['roles', search],
//     queryFn: () => getAllRoles(token, search, 0, 100).then(res => res.content),
//     enabled: !!token,
//     staleTime: 1000 * 60 * 10, // 10 phút
//     gcTime: 1000 * 60 * 30,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });
// };



import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService, type RoleRequest } from '../service/roleService';
import { message } from 'antd';

type UseRolesOptions = {
  enabled?: boolean;
};

export const useRole = (token: string) => {
  const queryClient = useQueryClient();

  // Get all roles
  const useRoles = (
    page: number,
    size: number = 10,
    search?: string,
    options?: UseRolesOptions
  ) => {
    const offset = page * size;
    
    return useQuery({
      queryKey: ['roles', page, size, search],
      queryFn: () => roleService.getAllRoles(token, offset, size, search),
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

  // Get role by ID
  const useRoleById = (id: number) => {
    return useQuery({
      queryKey: ['role', id],
      queryFn: () => roleService.getRoleById(id, token),
      enabled: !!id && !!token,
    });
  };

  // Create role
  const useCreateRole = () => {
    return useMutation({
      mutationFn: (data: RoleRequest) => roleService.createRole(data, token),
      onSuccess: () => {
        message.success('Tạo vai trò thành công!');
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Tạo vai trò thất bại');
      },
    });
  };

  // Update role
  const useUpdateRole = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: RoleRequest }) =>
        roleService.updateRole(id, data, token),
      onSuccess: () => {
        message.success('Cập nhật vai trò thành công!');
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        queryClient.invalidateQueries({ queryKey: ['role'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Cập nhật vai trò thất bại');
      },
    });
  };

  // Delete role
  const useDeleteRole = () => {
    return useMutation({
      mutationFn: (id: number) => roleService.deleteRole(id, token),
      onSuccess: () => {
        message.success('Xóa vai trò thành công!');
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
      onError: (err: any) => {
        message.error(err.message || 'Xóa vai trò thất bại');
      },
    });
  };

  return {
    useRoles,
    useRoleById,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
  };
};