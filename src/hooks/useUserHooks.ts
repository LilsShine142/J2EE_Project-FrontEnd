// // src/hooks/useUserHooks.ts
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getCurrentUser, logout } from '../service/authService';
// import { getAllUsers, getUserById, type ApiResponse, type PageResponse } from '../service/userService';
// import { type User } from '../types/index';
// import { message } from 'antd';
// import Cookies from 'js-cookie';

// // === KEY CHO REACT QUERY ===
// const CURRENT_USER_KEY = ['currentUser'];
// const USER_BY_ID_KEY = (id: number) => ['user', id];

// /**
//  * Lấy user theo ID từ API (dùng userService)
//  */
// export const useUserById = (userId: number | undefined) => {
//   return useQuery<PageResponse<User>, Error>({
//     queryKey: USER_BY_ID_KEY(userId!),
//     queryFn: () => getUserById(userId!),
//     enabled: !!userId,
//     staleTime: 1000 * 60 * 5,
//     gcTime: 1000 * 60 * 10,
//     retry: 1,
//     refetchOnWindowFocus: false,
//   });
// };


// /**
//  * Hook lấy thông tin người dùng hiện tại
//  * - Dùng useQuery → hiển thị trong React Query Devtools
//  * - Tự động đọc từ cookie
//  * - Cache + staleTime thông minh
//  */
// export const useCurrentUser = () => {
//   const queryClient = useQueryClient();

//   return useQuery<User | null, Error>({
//     queryKey: CURRENT_USER_KEY,
//     queryFn: () => {
//         // const user = getCurrentUser();
//         const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
//         console.log('Current user fetched:', user);
//       if (!user) {
//         // Nếu không có user → có thể token hết hạn
//         message.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
//         logout();
//         queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
//       }
//       return user;
//     },
//     staleTime: 1000 * 60 * 5, // 5 phút không cần refetch
//     gcTime: 1000 * 60 * 10, // 10 phút giữ cache
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//     retry: 1,
//     // Chỉ chạy nếu có token (tối ưu)
//     enabled: !!Cookies.get('authToken'),
//   });
// };

// /**
//  * Hook cập nhật user vào cache (dùng sau login/register)
//  */
// export const useSetCurrentUser = () => {
//   const queryClient = useQueryClient();

//   return (user: User) => {
//     queryClient.setQueryData(CURRENT_USER_KEY, user);
//   };
// };

// /**
//  * Hook xóa user khỏi cache (dùng khi logout)
//  */
// export const useRemoveCurrentUser = () => {
//   const queryClient = useQueryClient();

//   return () => {
//     queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
//   };
// };

// /**
//  * Lấy danh sách tất cả người dùng
//  */
// export const useAllUsers = (
//   token: string,
//   roleId?: number,
//   statusId?: number,
//   search?: string,
//   page: number = 1,
//   size: number = 10
// ) => {
//   const queryClient = useQueryClient();

//   const query = useQuery<ApiResponse, Error>({
//     queryKey: ['allUsers', roleId, statusId, search, page, size],
//     queryFn: () => {
//       console.log('Calling getAllUsers with:', {
//         roleId,
//         statusId,
//         search,
//         page: page - 1,
//         size
//       });
      
//       // Truyền undefined khi không filter, axios sẽ tự động bỏ qua param đó
//       return getAllUsers(
//         token,
//         roleId,           // undefined nếu không filter
//         statusId,         // undefined nếu không filter
//         search,           // undefined nếu không filter
//         page - 1,         // API nhận page bắt đầu từ 0
//         size
//       );
//     },
//     enabled: !!token,
//     staleTime: 1000 * 60 * 2,
//     gcTime: 1000 * 60 * 10,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   const refetch = () => {
//     queryClient.invalidateQueries({
//       queryKey: ['allUsers', roleId, statusId, search, page, size],
//     });
//   };

//   return {
//     ...query,
//     refetch,
//   };
// };




import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getCurrentUser, logout } from '../service/authService';
import { getAllUsers, getUserById, createUser, type ApiResponse, type PageResponse } from '../service/userService';
import { type User } from '../types/index';
import { RoleID } from '../lib/constants/constants';
import { message } from 'antd';
import Cookies from 'js-cookie';

// === KEY CHO REACT QUERY ===
const CURRENT_USER_KEY = ['currentUser'];
const USER_BY_ID_KEY = (id: number) => ['user', id];
const ALL_USERS_KEY = 'allUsers';

/**
 * Lấy user theo ID từ API (dùng userService)
 */
export const useUserById = (userId: number | undefined) => {
  return useQuery<PageResponse<User>, Error>({
    queryKey: USER_BY_ID_KEY(userId!),
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook lấy thông tin người dùng hiện tại
 */
export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery<User | null, Error>({
    queryKey: CURRENT_USER_KEY,
    queryFn: () => {
      const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
      console.log('Current user fetched:', user);
      if (!user) {
        message.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        logout();
        queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
      }
      return user;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    enabled: !!Cookies.get('authToken'),
  });
};

/**
 * Hook cập nhật user vào cache
 */
export const useSetCurrentUser = () => {
  const queryClient = useQueryClient();
  return (user: User) => {
    queryClient.setQueryData(CURRENT_USER_KEY, user);
  };
};

/**
 * Hook xóa user khỏi cache
 */
export const useRemoveCurrentUser = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
  };
};

/**
 * Lấy danh sách tất cả người dùng
 */
export const useAllUsers = (
  token: string,
  roleId?: number,
  statusId?: number,
  search?: string,
  page: number = 1,   
  size: number = 10
) => {
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponse, Error>({
    queryKey: [ALL_USERS_KEY, roleId, statusId, search, page, size],
    queryFn: () => {
      console.log('Calling getAllUsers with:', { 
        roleId, 
        statusId, 
        search,
        page: page - 1, 
        size 
      });
      
      return getAllUsers(
        token, 
        roleId,
        statusId,
        search,
        page - 1,
        size
      );
    }, 
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [ALL_USERS_KEY, roleId, statusId, search, page, size],
    });
  };

  return {
    ...query,
    refetch,
  };
};

/**
 * Hook tạo user mới (cho customer)
 */
export const useCreateUser = (token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      fullName: string;
      phoneNumber: string; 
      email: string;
      address?: string;
      password: string;
      roleId: number;
      statusId: number; 
      statusWork: number; 
    }) => {
      if (!token) throw new Error('Token không hợp lệ');
      console.log('🚀 Creating user with data:', userData);
      return createUser(token, userData);
    },
    onSuccess: (response) => {
      console.log('User created successfully:', response);
      
      message.success({
        content: 'Đã thêm khách hàng mới thành công!',
        icon: '✅',
        duration: 3,
      });
      
      // Invalidate all users queries để refresh data
      queryClient.invalidateQueries({ queryKey: [ALL_USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['customersForOrder'] });
      
      return response.data;
    },
    onError: (error: any) => {
      console.error('Create user error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || 'Không thể thêm khách hàng mới';
      
      message.error(errorMessage);
    },
  });
};

/**
 * Hook lấy danh sách users cho order form (customers only)
 */
export const useCustomersForOrder = (token: string | null) => {
  return useQuery({
    queryKey: ['customersForOrder'],
    queryFn: async () => {
      if (!token) throw new Error('Token không hợp lệ');
      
      // Lấy users với roleID = 1 (CUSTOMER), statusId = 1 (ACTIVE)
      const response = await getAllUsers(token, RoleID.CUSTOMER, 1, undefined, 0, 100);
      console.log('Customers for order API response:', response);
      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách khách hàng');
      }

      console.log('Customers for order data:', response.data);

      // Map sang format UserOption
      const users = response.data?.users || [];
      console.log('Mapped customers for order:', users);
      return users;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 phút
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};