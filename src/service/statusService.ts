import { axiosInstance } from '../lib/axios/axios';
import { configToken } from './authService';

export interface Status {
  statusID: number;
  statusName: string;
  description?: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StatusPageResponse {
  content: Status[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getAllStatuses = async (
  token: string,
  search?: string,
  page: number = 0,
  size: number = 100
): Promise<StatusPageResponse> => {
  try {
    const params: any = { offset: page * size, limit: size };
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const response = await axiosInstance.get<{ data: StatusPageResponse }>('/statuses/getall', {
      params,
      ...configToken(token),
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching statuses:', error);
    throw new Error(error.response?.data?.message || 'Lấy danh sách trạng thái thất bại');
  }
};