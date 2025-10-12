/**
 * Summary Data Hooks using TanStack Query
 *
 * Provides hooks for summary-related data fetching and mutations:
 * - Fetching summaries by parent timeline
 * - Creating, updating, and deleting summaries
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { summaryService } from "@/services";
import type { Summary } from "@/models";

// Query keys for summaries
const summaryKeys = {
  all: () => ["summaries"] as const,
  lists: () => [...summaryKeys.all(), "list"] as const,
  list: (filters?: any) => [...summaryKeys.lists(), filters] as const,
  details: () => [...summaryKeys.all(), "detail"] as const,
  detail: (id: string) => [...summaryKeys.details(), id] as const,
  byParent: (parentId: string) =>
    [...summaryKeys.all(), "byParent", parentId] as const,
};

/**
 * Hook to fetch a single summary by ID
 * @param summaryId - Summary identifier
 */
export function useSummary(summaryId: string) {
  return useQuery({
    queryKey: summaryKeys.detail(summaryId),
    queryFn: () => summaryService.fetchSummary(summaryId),
    enabled: !!summaryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch summary by parent timeline
 * @param parentId - Parent timeline identifier
 */
export function useSummaryByParent(parentId: string) {
  return useQuery({
    queryKey: summaryKeys.byParent(parentId),
    queryFn: () => summaryService.fetchSummaryByParent(parentId),
    enabled: !!parentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Mutation hook to create a summary
 */
export function useCreateSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Summary>) => summaryService.createSummary(data),
    onSuccess: (newSummary) => {
      // Invalidate parent timeline's summary
      if (newSummary.parent_id) {
        queryClient.invalidateQueries({
          queryKey: summaryKeys.byParent(newSummary.parent_id),
        });
      }

      // Invalidate all summaries list
      queryClient.invalidateQueries({
        queryKey: summaryKeys.lists(),
      });
    },
  });
}

/**
 * Mutation hook to update a summary
 */
export function useUpdateSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Summary> }) =>
      summaryService.updateSummary(id, data),
    onSuccess: (updatedSummary) => {
      // Update the specific summary in cache
      queryClient.setQueryData(
        summaryKeys.detail(updatedSummary.id),
        updatedSummary
      );

      // Invalidate parent timeline's summary
      if (updatedSummary.parent_id) {
        queryClient.invalidateQueries({
          queryKey: summaryKeys.byParent(updatedSummary.parent_id),
        });
      }
    },
  });
}

/**
 * Mutation hook to delete a summary (soft delete)
 */
export function useDeleteSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summaryId: string) => summaryService.deleteSummary(summaryId),
    onSuccess: () => {
      // Invalidate all summary queries
      queryClient.invalidateQueries({
        queryKey: summaryKeys.all(),
      });
    },
  });
}

