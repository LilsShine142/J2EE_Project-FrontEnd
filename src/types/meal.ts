export interface MealDTO {
  mealID: number;
  mealName: string;
  price: number;
  image?: string;
  categoryID: number;
  categoryName: string;
  statusId: number;
  totalOrdered?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MealRequestDTO {
  mealName: string;
  price: number;
  categoryID: number;
  statusId: number;
  image?: string;
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

export interface PopularMealDTO extends MealDTO {
  totalOrdered: number;
}