// src/hooks/useUserHooks.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, type User, logout } from '../service/authService';
import { getUserById, type UserResponse } from '../service/userService';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { Cookie } from 'lucide-react';

// === KEY CHO REACT QUERY ===
const CURRENT_USER_KEY = ['currentUser'];
const USER_BY_ID_KEY = (id: number) => ['user', id];

/**
 * Lấy user theo ID từ API (dùng userService)
 */
export const useUserById = (userId: number | undefined) => {
  return useQuery<UserResponse, Error>({
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
 * - Dùng useQuery → hiển thị trong React Query Devtools
 * - Tự động đọc từ cookie
 * - Cache + staleTime thông minh
 */
export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery<User | null, Error>({
    queryKey: CURRENT_USER_KEY,
    queryFn: () => {
        // const user = getCurrentUser();
        const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        console.log('Current user fetched:', user);
      if (!user) {
        // Nếu không có user → có thể token hết hạn
        message.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        logout();
        queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
      }
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 phút không cần refetch
    gcTime: 1000 * 60 * 10, // 10 phút giữ cache
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    // Chỉ chạy nếu có token (tối ưu)
    enabled: !!Cookies.get('authToken'),
  });
};

/**
 * Hook cập nhật user vào cache (dùng sau login/register)
 */
export const useSetCurrentUser = () => {
  const queryClient = useQueryClient();

  return (user: User) => {
    queryClient.setQueryData(CURRENT_USER_KEY, user);
  };
};

/**
 * Hook xóa user khỏi cache (dùng khi logout)
 */
export const useRemoveCurrentUser = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
  };
};