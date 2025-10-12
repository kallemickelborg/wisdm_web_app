/**
 * Search Hooks using TanStack Query
 * 
 * Provides hooks for search functionality with:
 * - Debounced search
 * - Automatic caching
 * - Search suggestions
 * - Recent searches
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { searchService } from "@/services";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import type { SearchQuery, SearchResult, SearchSuggestion } from "@/models";

/**
 * Hook for global search with debouncing
 * @param query - Search query parameters
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useSearch(query: SearchQuery, debounceMs: number = 400) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: [...queryKeys.search.results(debouncedQuery.query), debouncedQuery],
    queryFn: () => searchService.search(debouncedQuery),
    enabled: !!debouncedQuery.query && debouncedQuery.query.trim().length > 0,
    ...cacheConfig.search,
  });
}

/**
 * Hook for simple search with just a query string
 * @param queryString - Search query string
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useSimpleSearch(queryString: string, debounceMs: number = 400) {
  return useSearch({ query: queryString }, debounceMs);
}

/**
 * Hook to search timelines only
 * @param query - Search query string
 * @param limit - Number of results
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useSearchTimelines(
  query: string,
  limit: number = 10,
  debounceMs: number = 400
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: [...queryKeys.search.all(), "timelines", debouncedQuery, limit],
    queryFn: () => searchService.searchTimelines(debouncedQuery, limit),
    enabled: !!debouncedQuery && debouncedQuery.trim().length > 0,
    ...cacheConfig.search,
  });
}

/**
 * Hook to search comments only
 * @param query - Search query string
 * @param limit - Number of results
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useSearchComments(
  query: string,
  limit: number = 10,
  debounceMs: number = 400
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: [...queryKeys.search.all(), "comments", debouncedQuery, limit],
    queryFn: () => searchService.searchComments(debouncedQuery, limit),
    enabled: !!debouncedQuery && debouncedQuery.trim().length > 0,
    ...cacheConfig.search,
  });
}

/**
 * Hook to search users only
 * @param query - Search query string
 * @param limit - Number of results
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useSearchUsers(
  query: string,
  limit: number = 10,
  debounceMs: number = 400
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: [...queryKeys.search.all(), "users", debouncedQuery, limit],
    queryFn: () => searchService.searchUsers(debouncedQuery, limit),
    enabled: !!debouncedQuery && debouncedQuery.trim().length > 0,
    ...cacheConfig.search,
  });
}

/**
 * Hook to get search suggestions
 * @param query - Partial search query
 * @param limit - Number of suggestions
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useSearchSuggestions(
  query: string,
  limit: number = 5,
  debounceMs: number = 300
) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: [...queryKeys.search.all(), "suggestions", debouncedQuery, limit],
    queryFn: () => searchService.getSuggestions(debouncedQuery, limit),
    enabled: !!debouncedQuery && debouncedQuery.trim().length > 0,
    ...cacheConfig.search,
  });
}

/**
 * Hook to get recent searches
 * @param limit - Number of recent searches
 */
export function useRecentSearches(limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.search.all(), "recent", limit],
    queryFn: () => searchService.getRecentSearches(limit),
    ...cacheConfig.search,
  });
}

/**
 * Mutation hook to clear recent searches
 */
export function useClearRecentSearches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchService.clearRecentSearches(),
    onSuccess: () => {
      // Invalidate recent searches cache
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.search.all(), "recent"],
      });
    },
  });
}

