import { useQuery } from '@tanstack/react-query';
import { getAllStatuses, type Status } from '../service/statusService';

export const useGetAllStatuses = (token: string, search?: string) => {
  return useQuery<Status[], Error>({
    queryKey: ['statuses', search],
    queryFn: () => getAllStatuses(token, search, 0, 100).then(res => res.content),
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};