import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  type NotificationDTO,
  type NotificationRequest
} from '../service/notificationsService';

export const useNotification = (token: string | null) => {
  const queryClient = useQueryClient();

  /**
   * Lấy danh sách notifications
   */
  const useNotifications = (
    page: number = 0,
    size: number = 10,
    search?: string,
    enabled: boolean = true
  ) => {
    return useQuery({
      queryKey: ['notifications', page, size, search],
      queryFn: () => getNotifications(token, page, size, search),
      enabled,
      staleTime: 0,
      refetchOnWindowFocus: false,
    });
  };

  /**
   * Lấy chi tiết notification
   */
  const useNotificationDetail = (id: number, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['notificationDetail', id],
      queryFn: () => getNotificationById(token, id),
      enabled: !!id && enabled,
    });
  };

  /**
   * Tạo notification
   */
  const useCreateNotification = () => {
    return useMutation({
      mutationFn: (request: NotificationRequest) => createNotification(token, request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  /**
   * Cập nhật notification
   */
  const useUpdateNotification = () => {
    return useMutation({
      mutationFn: ({ id, request }: { id: number; request: NotificationRequest }) =>
        updateNotification(token, id, request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notificationDetail'] });
      },
    });
  };

  /**
   * Xóa notification
   */
  const useDeleteNotification = () => {
    return useMutation({
      mutationFn: (id: number) => deleteNotification(token, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  /**
   * Đánh dấu đã đọc
   */
  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: (id: number) => markAsRead(token, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notificationDetail'] });
      },
    });
  };

  return {
    useNotifications,
    useNotificationDetail,
    useCreateNotification,
    useUpdateNotification,
    useDeleteNotification,
    useMarkAsRead,
  };
};