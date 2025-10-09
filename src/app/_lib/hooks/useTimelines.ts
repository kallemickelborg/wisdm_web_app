/**
 * Timeline Data Hooks using TanStack Query
 * Simplified to only include actively used functions
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import { buildTimelineCategoryUrl } from "../../_config/categories";

/**
 * Timeline interface - simplified to only required fields
 */
export interface Timeline {
  id: string;
  parent_id: string;
  title: string;
  image: string;
  summary?: string;
  methodology?: string;
  topic_statement?: string;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch timelines by category
 */
async function fetchTimelinesByCategory(
  categoryId: string,
  idToken: string
): Promise<Timeline[]> {
  const url = buildTimelineCategoryUrl(categoryId);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch timelines for category ${categoryId}: ${response.status}`
    );
  }

  const data = await response.json();
  return data.timelines || [];
}

/**
 * Hook to fetch multiple categories at once
 * This is the only hook actually being used in the application
 */
export function useMultipleCategoryTimelines(categoryIds: string[]) {
  const { idToken, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["timelines", "multiple-categories", categoryIds.sort()],
    queryFn: async () => {
      const results = await Promise.allSettled(
        categoryIds.map((categoryId) =>
          fetchTimelinesByCategory(categoryId, idToken!)
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
    enabled: isAuthenticated && !!idToken && categoryIds.length > 0,
    ...cacheConfig.timelines,
  });
}
