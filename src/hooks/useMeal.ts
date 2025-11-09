import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getAllMeals,
  getMealById,
  getMealsByCategoryId,
  createMeal,
  updateMeal,
  deleteMeal,
  type MealDTO,
  type MealRequestDTO,
  type PaginatedMeals,
  type PopularMealDTO,
  getPopularMeals,
} from '../service/mealService';
import { message } from 'antd';
import type { PageResponse } from '../service/categoryService';

type UseMealOptions = {
  enabled?: boolean;
};

export const useMeal = (token: string | null) => {
  const queryClient = useQueryClient();

  // 1. LẤY DANH SÁCH MEAL
  const useMeals = (
    filters: {
      page?: number;
      size?: number;
      search?: string;
      statusId?: number;
      categoryId?: number;
      minPrice?: number;
      maxPrice?: number;
    } = {},
    options?: UseMealOptions
  ) => {
    const { page = 0, size = 10, ...rest } = filters;

    return useQuery<PaginatedMeals, Error>({
      queryKey: ['meals', page, size, rest],
      queryFn: () => getAllMeals(token, { offset: page * size, limit: size, ...rest }),
      enabled: (options?.enabled ?? true) && !!token,
      placeholderData: { items: [], total: 0, offset: 0, limit: size },
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });
  };

  // 2. LẤY MEAL THEO CATEGORY
  // const useMealsByCategory = (
  //   categoryId: number,
  //   filters: {
  //     page?: number;
  //     size?: number;
  //     search?: string;
  //     statusId?: number;
  //     minPrice?: number;
  //     maxPrice?: number;
  //   } = {},
  //   options?: UseMealOptions
  // ) => {
  //   const { page = 0, size = 10, ...rest } = filters;

  //   return useQuery<PaginatedMeals, Error>({
  //     queryKey: ['meals', 'category', categoryId, page, size, rest],
  //     queryFn: () =>
  //       getMealsByCategoryId(token, categoryId, {
  //         offset: page * size,
  //         limit: size,
  //         ...rest,
  //       }),
  //     enabled: (options?.enabled ?? true) && !!token && !!categoryId,
  //     placeholderData: { items: [], total: 0, offset: 0, limit: size },
  //     staleTime: 5 * 60 * 1000,
  //   });
  // };
  const useMealsByCategory = (
    categoryId: number,
    params: { offset: number; limit: number },
    options?: { enabled?: boolean }
  ) => {
    return useQuery<PaginatedMeals, Error>({
      queryKey: ['meals', categoryId, params.offset, params.limit],
      queryFn: () => getMealsByCategoryId(token, categoryId, { ...params }),
      enabled: !!token && !!categoryId && (options?.enabled ?? true),
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      placeholderData: keepPreviousData, // GIỮ DỮ LIỆU KHI ĐỔI TAB
      retry: 1,
    });
  };

  // === THÊM: LẤY TOP 9 MÓN PHỔ BIẾN ===
  const usePopularMeals = (limit = 9, options?: UseMealOptions) => {
    return useQuery<PopularMealDTO[], Error>({
      queryKey: ['popular-meals', limit],
      queryFn: () => getPopularMeals(token, limit),
      enabled: (options?.enabled ?? true) && !!token,
      staleTime: 10 * 60 * 1000, // Cache 10 phút
      gcTime: 30 * 60 * 1000,
      placeholderData: keepPreviousData,
      retry: 1,
    });
  };

  // 3. LẤY MEAL THEO ID
  const useMealById = (mealID: number) => {
    return useQuery<MealDTO, Error>({
      queryKey: ['meal', mealID],
      queryFn: () => getMealById(token, mealID),
      enabled: !!mealID && !!token,
    });
  };

  // 4. TẠO MEAL
  const useCreateMeal = () => {
    return useMutation({
      mutationFn: (data: MealRequestDTO) => createMeal(token, data),
      onSuccess: (newMeal) => {
        message.success('Tạo món ăn thành công');
        queryClient.invalidateQueries({ queryKey: ['meals'] });
        queryClient.setQueryData(['meal', newMeal.mealID], newMeal);
      },
      onError: (err) => message.error(err.message || 'Tạo món ăn thất bại'),
    });
  };

  // 5. CẬP NHẬT MEAL
  const useUpdateMeal = () => {
    return useMutation({
      mutationFn: ({ mealID, data }: { mealID: number; data: Partial<MealRequestDTO> }) =>
        updateMeal(token, mealID, data),
      onSuccess: (updated) => {
        message.success('Cập nhật món ăn thành công');
        queryClient.invalidateQueries({ queryKey: ['meals'] });
        queryClient.setQueryData(['meal', updated.mealID], updated);
      },
      onError: (err) => message.error(err.message || 'Cập nhật thất bại'),
    });
  };

  // 6. XÓA MEAL + OPTIMISTIC
  const useDeleteMeal = () => {
    return useMutation({
      mutationFn: (mealID: number) => deleteMeal(token, mealID),
      onMutate: async (mealID) => {
        await queryClient.cancelQueries({ queryKey: ['meals'] });
        const previous = queryClient.getQueryData<PaginatedMeals>(['meals', 0, 10]);

        queryClient.setQueryData(['meals', 0, 10], (old: PaginatedMeals | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.filter((m) => m.mealID !== mealID),
            total: old.total - 1,
          };
        });

        return { previous };
      },
      onError: (err, _, context: any) => {
        queryClient.setQueryData(['meals', 0, 10], context.previous);
        message.error(err.message || 'Xóa thất bại');
      },
      onSuccess: () => {
        message.success('Xóa món ăn thành công');
        queryClient.invalidateQueries({ queryKey: ['meals'] });
      },
    });
  };

  return {
    useMeals,
    useMealsByCategory,
    usePopularMeals,
    useMealById,
    useCreateMeal,
    useUpdateMeal,
    useDeleteMeal,
  };
};