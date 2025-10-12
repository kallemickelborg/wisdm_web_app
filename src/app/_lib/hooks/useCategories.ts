/**
 * Category Data Hooks using TanStack Query
 *
 * Provides hooks for category-related data fetching and mutations:
 * - Fetching categories
 * - Creating, updating, and deleting categories
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services";
import type { Category } from "@/models";

// Query keys for categories
const categoryKeys = {
  all: () => ["categories"] as const,
  lists: () => [...categoryKeys.all(), "list"] as const,
  list: (filters?: any) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all(), "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.fetchCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single category by ID
 * @param categoryId - Category identifier
 */
export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => categoryService.fetchCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Mutation hook to create a category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Category>) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      // Invalidate categories list to refetch
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
}

/**
 * Mutation hook to update a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );

      // Invalidate categories list
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
}

/**
 * Mutation hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      categoryService.deleteCategory(categoryId),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all(),
      });
    },
  });
}

