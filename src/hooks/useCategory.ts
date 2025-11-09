// src/hooks/useCategory.ts
import { useQuery } from '@tanstack/react-query';
import { getAllCategories, type CategoryDTO, type PageResponse } from '../service/categoryService';

export const useCategory = (token: string | null) => {
  const useCategories = (page = 0, size = 100) => {
    return useQuery<PageResponse<CategoryDTO>, Error>({
      queryKey: ['categories', page, size],
      queryFn: () => getAllCategories(token, page, size),
      enabled: !!token,
      staleTime: 10 * 60 * 1000,
      placeholderData: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageable: { pageNumber: 0, pageSize: size, sort: {}, offset: 0, paged: true, unpaged: false },
        last: true,
        first: true,
        numberOfElements: 0,
        size,
        number: 0,
        empty: true,
      },
    });
  };

  return { useCategories };
};