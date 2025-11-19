// src/hooks/useTable.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getAvailableTables,
  getAllTableTypes,
  type RestaurantTableDTO,
  type TableTypeDTO,
  type ApiResponse,
  type PageResponse,
} from '../service/tableService';
import { configToken } from '../service/authService';
import { axiosInstance } from '../lib/axios/axios';

// LOẠI BÀN
export const useTableTypes = (token: string | null) => {
  return useQuery<TableTypeDTO[], Error>({
    queryKey: ['tableTypes'],
    queryFn: () => getAllTableTypes(token), 
    enabled: !!token, 
    staleTime: 10 * 60 * 1000,
    retry: 2,
    placeholderData: [], 
  });
};

// BÀN TRỐNG
export const useAvailableTables = (
  token: string | null,
  startTime: string,  
  endTime: string,
  capacity?: number,
  tableTypeId?: number
) => {
  return useQuery<RestaurantTableDTO[], Error>({
    queryKey: ['availableTables', startTime, capacity, tableTypeId],
    queryFn: async () => {
      if (!token) return [];

      const response = await axiosInstance.get<ApiResponse<PageResponse<RestaurantTableDTO>>>(
        '/tables/available',
        {
          params: {
            startTime,  
            tableTypeId,     
            capacity,
            offset: 0,
            limit: 100,
          },
          ...configToken(token),
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      let tables = response.data.data.content ?? [];

      return tables;
    },
    enabled: !!token && !!startTime && !!endTime,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};