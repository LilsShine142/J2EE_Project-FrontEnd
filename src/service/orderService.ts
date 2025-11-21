import { axiosInstance } from "../lib/axios/axios";
import { configToken } from "./authService";

// === SHARED TYPES ===
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// === ORDER DTOs ===
export interface OrderDetailDTO {
  id: number | null;
  orderID: number;
  mealID: number;
  mealName: string;
  mealPrice: number;
  quantity: number;
  subTotal: number;
  createAt: string;
  updateAt: string;
}

export interface OrderDTO {
  orderID: number;
  userID: number;
  userName: string;
  bookingID: number | null;
  tableID: number;
  tableName: string;
  orderDate: string;
  statusId: number;
  totalAmount: number | null;
  createdAt: string;
  updatedAt: string;
  orderDetails: OrderDetailDTO[];
}

export interface OrderDetailRequest {
  mealID: number;
  quantity: number;
}

export interface OrderRequestDTO {
  userID: number;
  tableID: number;
  bookingID?: number | null;
  statusId: number;
  orderDetails: OrderDetailRequest[];
}

export type PaginatedOrders = PageResponse<OrderDTO>;

// === ORDER FORM OPTIONS ===
export interface MealOption {
  mealID: number;
  mealName: string;
  price: number;
  categoryName: string;
  image?: string;
  statusId: number;
}

export interface TableOption {
  tableID: number;
  tableName: string;
  capacity: number;
  location: string;
  statusId: number;
  tableTypeName: string;
}

export interface UserOption {
  userId: number;
  fullName: string;
  phoneNumber?: string;
  email?: string;
}

// === ORDER APIs ===
export const createOrder = async (
  token: string | null,
  data: OrderRequestDTO
): Promise<OrderDTO> => {
  const response = await axiosInstance.post<ApiResponse<OrderDTO>>(
    '/orders/create',
    data,
    configToken(token)
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getAllOrders = async (
  token: string | null,
  page = 0,
  size = 10,
  search?: string,
  statusId?: number,
  userId?: number,
  tableId?: number
): Promise<PaginatedOrders> => {
  const params: any = { offset: page * size, limit: size };
  if (search) params.search = search;
  if (statusId !== undefined) params.statusId = statusId;
  if (userId !== undefined) params.userId = userId;
  if (tableId !== undefined) params.tableId = tableId;

  const response = await axiosInstance.get<ApiResponse<PaginatedOrders>>(
    '/orders',
    {
      params,
      ...configToken(token),
    }
  );

  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getOrderById = async (
  token: string | null,
  orderId: number
): Promise<OrderDTO> => {
  const response = await axiosInstance.get<ApiResponse<OrderDTO>>(
    `/orders/${orderId}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Không thể lấy thông tin đơn hàng");
  }

  return response.data.data;
};

export const updateOrder = async (
  token: string | null,
  orderId: number,
  data: OrderRequestDTO
): Promise<OrderDTO> => {
  const response = await axiosInstance.put<ApiResponse<OrderDTO>>(
    `/orders/${orderId}`,
    data,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Cập nhật thất bại");
  }

  return response.data.data;
};

export const deleteOrder = async (
  token: string | null,
  orderId: number
): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/orders/${orderId}`,
    configToken(token)
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Hủy đơn hàng thất bại");
  }
};

// === ORDER FORM DATA APIs ===

// Lấy danh sách món ăn
export const getAvailableMealsForOrder = async (
  token: string | null,
  search?: string
): Promise<MealOption[]> => {
  const params: any = { 
    offset: 0, 
    limit: 100,
    statusId: 1
  };
  if (search) params.search = search;

  const response = await axiosInstance.get<ApiResponse<PageResponse<any>>>(
    '/meals/getall',
    {
      params,
      ...configToken(token),
    }
  );

  if (!response.data.success) throw new Error(response.data.message);
  
  return response.data.data.content.map((meal: any) => ({
    mealID: meal.mealID,
    mealName: meal.mealName,
    price: meal.price,
    categoryName: meal.categoryName,
    image: meal.image,
    statusId: meal.statusId,
  }));
};

// ✅ Lấy danh sách bàn - Đã tối ưu
export const getAvailableTablesForOrder = async (
  token: string | null
): Promise<TableOption[]> => {
  const response = await axiosInstance.get<ApiResponse<PageResponse<any>>>(
    '/tables/getall',
    {
      params: { offset: 0, limit: 100 },
      ...configToken(token),
    }
  );

  if (!response.data.success) throw new Error(response.data.message);
  
  return response.data.data.content.map((table: any) => ({
    tableID: table.tableID,
    tableName: table.tableName,
    capacity: table.capacity || 0,
    location: table.location || '',
    statusId: table.statusId,
    tableTypeName: table.tableTypeName || 'Standard',
  }));
};

// ✅ Lấy danh sách users - Đã tối ưu
export const getUsersForOrder = async (
  token: string | null,
  search?: string
): Promise<UserOption[]> => {
  try {
    const params: any = { offset: 0, limit: 100 };
    if (search) params.search = search;

    const response = await axiosInstance.get<ApiResponse<any>>(
      '/users/get-all',
      {
        params,
        ...configToken(token),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể tải danh sách users');
    }

    const data = response.data.data;
    
    if (!data || !Array.isArray(data.users)) {
      console.warn('⚠️ Invalid users response structure:', data);
      return [];
    }

    return data.users.map((user: any) => ({
      userId: user.userId,
      fullName: user.fullName || 'Không có tên',
      phoneNumber: user.phoneNumber,
      email: user.email,
    }));

  } catch (error: any) {
    console.error('❌ getUsersForOrder error:', error);
    throw new Error(error.message || 'Không thể tải danh sách khách hàng');
  }
};