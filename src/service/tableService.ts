import { axiosInstance } from "../lib/axios/axios";
import { getAuthToken } from "./authService";

const configToken = (token: string | null) => {
  if (!token) throw new Error("Token không tồn tại");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export interface RestaurantTableDTO {
  tableID: number;
  tableName: string;
  location: string;
  statusId: number;
  statusName?: string;
  tableTypeID: number;
  tableTypeName?: string;
  capacity?: number;
}

export interface TableTypeDTO {
  id: number;         
  typeName: string;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// LẤY BÀN KHẢ DỤNG
export const getAvailableTables = async (
  token: string | null,
  bookingDate: string,
  startTime: string,
  endTime: string,
  capacity?: number
): Promise<PageResponse<RestaurantTableDTO>> => {
  const response = await axiosInstance.get<ApiResponse<PageResponse<RestaurantTableDTO>>>(
    '/tables/available',
    {
      params: {
        bookingDate,
        startTime,
        endTime,
        capacity,
        offset: 0,
        limit: 100,
      },
      ...configToken(token),
    }
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

// LẤY TẤT CẢ LOẠI BÀN
export const getAllTableTypes = async (
  token: string | null
): Promise<TableTypeDTO[]> => {
  if (!token) {
    return [];
  }

  try {
    const response = await axiosInstance.get<ApiResponse<PageResponse<any>>>(
      '/tabletypes/getall',
      {
        params: { offset: 0, limit: 50 },
        // ...configToken(token),
      }
    );

    // === DEBUG: IN RA ĐỂ XÁC NHẬN ===
    console.log('API getAllTableTypes raw response:', response.data);

    // === ĐẢM BẢO LẤY ĐÚNG content ===
    const content = response.data?.data?.content;

    if (!Array.isArray(content)) {
      console.warn('content không phải mảng:', content);
      return [];
    }

    // === MAP CHÍNH XÁC ===
    return content.map((item: any) => ({
      id: item.tableTypeID,
      typeName: item.typeName || 'Không tên',
      capacity: item.capacity || 0,
    }));

  } catch (error: any) {
    console.error('Lỗi gọi getAllTableTypes:', error);
    throw new Error(error.response?.data?.message || 'Không tải được loại bàn');
  }
};