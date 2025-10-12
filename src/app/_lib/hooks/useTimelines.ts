/**
 * Timeline Data Hooks using TanStack Query
 *
 * Provides hooks for timeline-related data fetching and mutations:
 * - Fetching timelines by category
 * - Fetching timeline details
 * - Creating and updating timelines
 * - Featured and trending timelines
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timelineService } from "@/services";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import type {
  Timeline,
  TimelineWithDetails,
  TimelineFilters,
  CreateTimelineRequest,
  UpdateTimelineRequest,
} from "@/models";

/**
 * Hook to fetch timelines by category
 * @param categoryId - Category identifier
 * @param filters - Optional filters
 */
export function useTimelinesByCategory(
  categoryId: string,
  filters?: TimelineFilters
) {
  return useQuery({
    queryKey: [...queryKeys.timelines.byCategory(categoryId), filters],
    queryFn: () =>
      timelineService.fetchTimelinesByCategory(categoryId, filters),
    enabled: !!categoryId,
    ...cacheConfig.timelines,
  });
}

/**
 * Hook to fetch multiple categories at once
 * This is used in the home page to fetch all category timelines
 */
export function useMultipleCategoryTimelines(categoryIds: string[]) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["timelines", "multiple-categories", categoryIds.sort()],
    queryFn: async () => {
      const results = await Promise.allSettled(
        categoryIds.map((categoryId) =>
          timelineService.fetchTimelinesByCategory(categoryId)
        )
      );

      const timelinesMap: { [key: string]: Timeline[] } = {};
      const errorsMap: { [key: string]: string | null } = {};

      results.forEach((result, index) => {
        const categoryId = categoryIds[index];
        if (result.status === "fulfilled") {
          timelinesMap[categoryId] = result.value;
          errorsMap[categoryId] = null;

          // Cache individual category results for potential future use
          queryClient.setQueryData(
            queryKeys.timelines.byCategory(categoryId),
            result.value
          );
        } else {
          timelinesMap[categoryId] = [];
          errorsMap[categoryId] =
            result.reason?.message || "Failed to fetch category timelines";
        }
      });

      return { timelinesMap, errorsMap };
    },
    enabled: categoryIds.length > 0,
    ...cacheConfig.timelines,
  });
}

/**
 * Hook to fetch timeline by ID
 * @param timelineId - Timeline identifier
 * @param enabled - Whether to enable the query
 */
export function useTimelineById(timelineId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.timelines.detail(timelineId),
    queryFn: () => timelineService.fetchTimelineById(timelineId),
    enabled: enabled && !!timelineId,
    ...cacheConfig.timelines,
  });
}

/**
 * Hook to fetch timeline with full details
 * @param timelineId - Timeline identifier
 * @param enabled - Whether to enable the query
 */
export function useTimelineDetails(
  timelineId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [...queryKeys.timelines.detail(timelineId), "full"],
    queryFn: () => timelineService.fetchTimelineDetails(timelineId),
    enabled: enabled && !!timelineId,
    ...cacheConfig.timelines,
  });
}

/**
 * Hook to fetch featured timelines
 * @param limit - Number of timelines to fetch
 */
export function useFeaturedTimelines(limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.timelines.all(), "featured", limit],
    queryFn: () => timelineService.fetchFeaturedTimelines(limit),
    ...cacheConfig.timelines,
  });
}

/**
 * Hook to fetch trending timelines
 * @param limit - Number of timelines to fetch
 */
export function useTrendingTimelines(limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.timelines.all(), "trending", limit],
    queryFn: () => timelineService.fetchTrendingTimelines(limit),
    ...cacheConfig.timelines,
  });
}

/**
 * Mutation hook to create a timeline
 */
export function useCreateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTimelineRequest) =>
      timelineService.createTimeline(request),
    onSuccess: (newTimeline) => {
      // Invalidate category timelines to refetch
      if (newTimeline.category_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.timelines.byCategory(newTimeline.category_id),
        });
      }

      // Invalidate all timelines list
      queryClient.invalidateQueries({
        queryKey: queryKeys.timelines.lists(),
      });
    },
  });
}

/**
 * Mutation hook to update a timeline
 */
export function useUpdateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTimelineRequest) =>
      timelineService.updateTimeline(request),
    onSuccess: (updatedTimeline) => {
      // Update the specific timeline in cache
      queryClient.setQueryData(
        queryKeys.timelines.detail(updatedTimeline.id),
        updatedTimeline
      );

      // Invalidate category timelines
      if (updatedTimeline.category_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.timelines.byCategory(updatedTimeline.category_id),
        });
      }
    },
  });
}

/**
 * Mutation hook to delete a timeline
 */
export function useDeleteTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timelineId: string) =>
      timelineService.deleteTimeline(timelineId),
    onSuccess: () => {
      // Invalidate all timeline queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.timelines.all(),
      });
    },
  });
}
