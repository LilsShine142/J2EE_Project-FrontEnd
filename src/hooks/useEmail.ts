import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    getEmailHistory,
    type EmailHistoryDTO,
  type EmailRequest,
  type EmailVerificationRequest,
  type PasswordResetRequest,
  getEmailById,
} from '../service/emailService';

export const useEmail = (token: string | null) => {
  const queryClient = useQueryClient();

  // ===== MUTATIONS =====

  /**
   * Gửi email linh hoạt
   */
  const useSendEmail = () => {
    return useMutation({
      mutationFn: (request: EmailRequest) => sendEmail(token, request),
      onSuccess: () => {
        message.success('Gửi email thành công!');
        // Invalidate nếu có query lịch sử
      },
      onError: (error: any) => {
        message.error(error.message || 'Gửi email thất bại!');
      },
    });
  };

  /**
   * Gửi email xác nhận
   */
  const useSendVerificationEmail = () => {
    return useMutation({
      mutationFn: (request: EmailVerificationRequest) => sendVerificationEmail(token, request),
      onSuccess: () => {
        message.success('Gửi email xác nhận thành công!');
      },
      onError: (error: any) => {
        message.error(error.message || 'Gửi email xác nhận thất bại!');
      },
    });
  };

  /**
   * Gửi email đặt lại mật khẩu
   */
  const useSendPasswordResetEmail = () => {
    return useMutation({
      mutationFn: (request: PasswordResetRequest) => sendPasswordResetEmail(token, request),
      onSuccess: () => {
        message.success('Gửi email đặt lại mật khẩu thành công!');
      },
      onError: (error: any) => {
        message.error(error.message || 'Gửi email đặt lại mật khẩu thất bại!');
      },
    });
  };

  /**
   * Gửi email chào mừng
   */
  const useSendWelcomeEmail = () => {
    return useMutation({
      mutationFn: (request: EmailVerificationRequest) => sendWelcomeEmail(token, request),
      onSuccess: () => {
        message.success('Gửi email chào mừng thành công!');
      },
      onError: (error: any) => {
        message.error(error.message || 'Gửi email chào mừng thất bại!');
      },
    });
  };
  
/**
   * Lấy lịch sử gửi email
   */
  const useEmailHistory = (
    offset: number = 0,
    limit: number = 10,
    userId?: number,
    startDate?: string,
    endDate?: string,
    type?: string,
    enabled: boolean = true
  ) => {
    return useQuery({
      queryKey: ['emailHistory', offset, limit, userId, startDate, endDate, type],
      queryFn: () => getEmailHistory(token, offset, limit, userId, startDate, endDate, type),
      enabled,
    });
  };

    /**
   * Lấy chi tiết email theo ID
   */
  const useEmailDetail = (id: number, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['emailDetail', id],
      queryFn: () => getEmailById(token, id),
      enabled: !!id && enabled,
    });
  };

  return {
    useSendEmail,
    useSendVerificationEmail,
    useSendPasswordResetEmail,
    useSendWelcomeEmail,
    useEmailHistory,
    useEmailDetail
  };
};