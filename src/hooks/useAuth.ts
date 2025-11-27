import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../service/authService';
import { useSetCurrentUser } from './useUserHooks';

export const useAuth = () => {
  const navigate = useNavigate();
  const setCurrentUser = useSetCurrentUser();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: ({ user }) => {
      message.success(`Chào mừng ${user.fullName}!`, 2);
      setCurrentUser(user);
      console.log('User:', user);
      // Kiểm tra roleId và chuyển hướng
      const roleId = user.roleId? user.roleId : user.role?.RoleId;
      if (roleId === 1) {
        navigate('/client/dashboard', { replace: true });
      } else if (roleId === 2 || roleId === 3) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        message.error('Vai trò không hợp lệ!');
      }
    },
    onError: (error: any) => {
      console.error('[LOGIN ERROR]', error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Đăng nhập thất bại! Vui lòng thử lại.';
      message.error(msg, 3);
    },
  });

  // ĐĂNG KÝ
  const registerMutation = useMutation({
    mutationFn: ({
      fullName,
      email,
      password,
      phoneNumber,
      statusId,
      statusWork,
      roleId,
    }: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber: string;
      statusId: number;
      statusWork: string;
      roleId: number;
    }) =>
      register(fullName, email, password, phoneNumber, statusId, statusWork, roleId),
    onSuccess: () => {
      // Không cần xử lý gì thêm, onSuccess ở AuthPage sẽ gọi
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Đăng ký thất bại!';
      message.error(msg, 3);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Xóa cart khỏi sessionStorage khi logout
      sessionStorage.removeItem('cart');
      message.success('Đăng xuất thành công');
      navigate('/client/auth', { replace: true });
    },
    onError: () => {
      message.error('Lỗi khi đăng xuất');
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLoginError: loginMutation.isError,
    isRegisterError: registerMutation.isError,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};