// src/service/clientService/mealService.ts
import { axiosInstance } from "../lib/axios/axios";
import { type PageResponse } from "./categoryService"; 

// === DTOs ===
export interface MealRequestDTO {
  mealName: string;
  image?: string;
  price: number;
  categoryID: number;
  statusId: number;
}

export interface MealDTO {
  mealID: number;
  mealName: string;
  image?: string;
  price: number;
  categoryID: number;
  categoryName: string;
  statusId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMeals {
  content: MealDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// === DTO CHO POPULAR MEAL ===
export interface PopularMealDTO extends MealDTO {
  totalOrdered: number;
}

// === Helper: config token ===
const configToken = (token: string | null) => {
  if (!token) throw new Error("Token không tồn tại");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// === LẤY TẤT CẢ MEAL (có filter + phân trang) ===
export const getAllMeals = async (
  token: string | null,
  {
    offset = 0,
    limit = 10,
    search = "",
    statusId,
    categoryId,
    minPrice,
    maxPrice,
  }: {
    offset?: number;
    limit?: number;
    search?: string;
    statusId?: number;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  } = {}
): Promise<PaginatedMeals> => {
  const params: any = { offset, limit, search };
  if (statusId !== undefined) params.statusId = statusId;
  if (categoryId !== undefined) params.categoryId = categoryId;
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined) params.maxPrice = maxPrice;

  const response = await axiosInstance.get<ApiResponse<PaginatedMeals>>(
    "/meals/getall",
    { params, ...configToken(token) }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy danh sách món ăn thất bại");
  }

  return response.data.data;
};

// === LẤY MEAL THEO ID ===
export const getMealById = async (token: string | null, mealID: number): Promise<MealDTO> => {
  const response = await axiosInstance.get<ApiResponse<MealDTO>>(
    `/meals/${mealID}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Không tìm thấy món ăn");
  }

  return response.data.data;
};

// === LẤY MEAL THEO CATEGORY ID ===
export const getMealsByCategoryId = async (
  token: string | null,
  categoryId: number,
  {
    offset = 0,
    limit = 10,
    search = "",
    statusId,
    minPrice,
    maxPrice,
  }: {
    offset?: number;
    limit?: number;
    search?: string;
    statusId?: number;
    minPrice?: number;
    maxPrice?: number;
  } = {}
): Promise<PaginatedMeals> => {
  const params: any = { offset, limit, search };
  if (statusId !== undefined) params.statusId = statusId;
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined) params.maxPrice = maxPrice;

  const response = await axiosInstance.get<ApiResponse<PageResponse<MealDTO>>>(
    `/meals/category/${categoryId}`,
    { params, ...configToken(token) }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy món theo danh mục thất bại");
  }

  const data = response.data.data;
  return data;
};

// === LẤY TOP 9 MÓN PHỔ BIẾN ===
export const getPopularMeals = async (
  token: string | null,
  limit = 9
): Promise<PopularMealDTO[]> => {
  const response = await axiosInstance.get<ApiResponse<PopularMealDTO[]>>(
    `/meals/popular?limit=${limit}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Lấy món phổ biến thất bại");
  }

  return response.data.data;
};

// === TẠO MỚI MEAL ===
export const createMeal = async (token: string | null, data: MealRequestDTO): Promise<MealDTO> => {
  const response = await axiosInstance.post<ApiResponse<MealDTO>>(
    "/meals/create",
    data,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Tạo món ăn thất bại");
  }

  return response.data.data;
};

// === CẬP NHẬT MEAL ===
export const updateMeal = async (
  token: string | null,
  mealID: number,
  data: Partial<MealRequestDTO>
): Promise<MealDTO> => {
  const response = await axiosInstance.put<ApiResponse<MealDTO>>(
    `/meals/update/${mealID}`,
    data,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Cập nhật món ăn thất bại");
  }

  return response.data.data;
};

// === XÓA MEAL ===
export const deleteMeal = async (token: string | null, mealID: number): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/meals/delete/${mealID}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Xóa món ăn thất bại");
  }
};