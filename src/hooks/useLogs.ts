import { useQuery } from '@tanstack/react-query';
import { getLogs, type LogDTO } from '../service/logService';

export const useLog = (token: string | null) => {
  /**
   * Lấy danh sách logs
   */
  const useLogs = (
    offset: number = 0,
    limit: number = 10,
    search?: string,
    enabled: boolean = true
  ) => {
    return useQuery({
      queryKey: ['logs', offset, limit, search],
      queryFn: () => getLogs(token, offset, limit, search),
      enabled,
      staleTime: 0,
      refetchOnWindowFocus: false,
    });
  };

  return {
    useLogs,
  };
};