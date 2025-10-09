"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./devtools.css";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Create QueryClient with optimized configuration
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache configuration
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,

        // Retry configuration
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Background refetch configuration
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,

        // Network mode
        networkMode: "online",
      },
      mutations: {
        // Retry configuration for mutations
        retry: (failureCount, error: any) => {
          // Don't retry mutations on client errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry once for server errors
          return failureCount < 1;
        },
        networkMode: "online",
      },
    },
  });
}

/**
 * Query Provider Component
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  // Create QueryClient instance (stable across re-renders)
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - Simple, non-intrusive configuration */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
};

export const queryKeys = {
  // Authentication
  auth: {
    all: () => ["auth"] as const,
    user: () => ["auth", "user"] as const,
    token: () => ["auth", "token"] as const,
  },

  // User data
  user: {
    all: () => ["user"] as const,
    profile: (userId?: string) => ["user", "profile", userId] as const,
    traits: (userId?: string) => ["user", "traits", userId] as const,
  },

  // Timelines
  timelines: {
    all: () => ["timelines"] as const,
    lists: () => [...queryKeys.timelines.all(), "list"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.timelines.lists(), filters] as const,
    details: () => [...queryKeys.timelines.all(), "detail"] as const,
    detail: (id: string) => [...queryKeys.timelines.details(), id] as const,
    byCategory: (categoryId: string) =>
      [...queryKeys.timelines.all(), "category", categoryId] as const,
  },

  // Categories
  categories: {
    all: () => ["categories"] as const,
    active: () => [...queryKeys.categories.all(), "active"] as const,
  },

  // Notifications
  notifications: {
    all: () => ["notifications"] as const,
    list: () => [...queryKeys.notifications.all(), "list"] as const,
    unread: () => [...queryKeys.notifications.all(), "unread"] as const,
  },

  // Comments
  comments: {
    all: () => ["comments"] as const,
    thread: (threadId: string) =>
      [...queryKeys.comments.all(), "thread", threadId] as const,
    trending: () => [...queryKeys.comments.all(), "trending"] as const,
  },

  // Search
  search: {
    all: () => ["search"] as const,
    results: (query: string) => ["search", query] as const,
  },
} as const;

export const cacheConfig = {
  // Authentication data - short cache, frequent updates
  auth: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  // User profile data - medium cache
  user: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },

  // Timeline data - medium cache with background updates
  timelines: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },

  // Category data - long cache (rarely changes)
  categories: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Notification data - short cache (real-time updates)
  notifications: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  // Comment data - medium cache
  comments: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Search results - short cache (dynamic content)
  search: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

export default QueryProvider;
