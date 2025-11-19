// src/service/clientService/categoryService.ts
import { axiosInstance } from "../lib/axios/axios";

export interface CategoryDTO {
  categoryID: number;
  categoryName: string;
  description?: string;
  image?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

const configToken = (token: string | null) => {
  if (!token) throw new Error("Token không tồn tại");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAllCategories = async (
  token: string | null,
  page = 0,
  size = 100
): Promise<PageResponse<CategoryDTO>> => {
  const response = await axiosInstance.get<ApiResponse<PageResponse<CategoryDTO>>>(
    "/categories/getall",
    {
      params: { offset: page * size, limit: size },
      ...configToken(token),
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy danh sách danh mục thất bại");
  }

  return response.data.data; // Trả về TOÀN BỘ PageResponse
};