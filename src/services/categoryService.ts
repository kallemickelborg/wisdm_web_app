/**
 * Category Service
 *
 * Handles all API calls related to content categories.
 * Following Services Architecture:
 * - All API calls go through services layer
 * - Returns Promises (errors thrown, not caught)
 * - No business logic in services
 * - Types imported from @/models
 */

import { apiClient } from "./api/apiClient";
import type { Category } from "@/models";

export const categoryService = {
  fetchCategory: async (categoryId: string): Promise<Category> => {
    const queryParams = apiClient.buildQueryString({ id: categoryId });
    return apiClient.get<Category>(`/categories/get/category${queryParams}`);
  },

  fetchCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<{ categories: Category[] }>(
      "/categories/get/categories"
    );
    return response.categories;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    return apiClient.post<Category>("/categories/post/category", data);
  },

  updateCategory: async (
    categoryId: string,
    data: Partial<Category>
  ): Promise<Category> => {
    return apiClient.put<Category>("/categories/put/category", {
      id: categoryId,
      ...data,
    });
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    return apiClient.delete(`/categories/delete/category?id=${categoryId}`);
  },
};
