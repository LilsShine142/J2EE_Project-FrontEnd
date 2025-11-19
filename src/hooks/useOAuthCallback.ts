// src/hooks/useOAuthCallback.ts
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { oauth2Callback, type AuthData } from '../service/authService';

export const useOAuthCallback = (
  provider: string | undefined,
  code: string | null
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation<AuthData, Error, { provider: string; code: string }>({
    mutationFn: ({ provider, code }) => oauth2Callback(provider as 'google' | 'facebook', code),
    onSuccess: () => {
      message.success('Đăng nhập thành công!');
      queryClient.removeQueries({ queryKey: ['oauth-callback'] });
      navigate('/client/dashboard', { replace: true });
    },
    onError: (error) => {
      message.error(error.message || 'Đăng nhập thất bại');
      navigate('/client/auth', { replace: true });
    },
  });

  // TỰ ĐỘNG CHẠY KHI CÓ provider + code
  useEffect(() => {
    if (provider && code) {
      mutation.mutate({ provider, code });
    } else if (provider || code) {
      // Thiếu 1 trong 2 → lỗi
      message.error('Thông tin xác thực không đầy đủ');
      navigate('/client/auth', { replace: true });
    }
    
  }, [provider, code]);

  return {
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};