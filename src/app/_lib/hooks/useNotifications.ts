/**
 * Notification Hooks using TanStack Query
 *
 * Provides hooks for notification-related data fetching and mutations:
 * - Fetching notifications
 * - Marking notifications as read
 * - Notification settings
 * - Real-time updates
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import { useAuth } from "./useAuth";
import type {
  Notification,
  NotificationFilters,
  NotificationSettings,
  MarkNotificationReadRequest,
} from "@/models";

/**
 * Hook to fetch notifications
 * @param filters - Optional filters
 *
 * Note: This query is only enabled when the user is authenticated
 */
export function useNotifications(filters?: NotificationFilters) {
  const { isAuthenticated, idToken } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.notifications.list(), filters],
    queryFn: () => notificationService.fetchNotifications(filters),
    enabled: isAuthenticated && !!idToken, // Only fetch when authenticated with valid token
    ...cacheConfig.notifications,
  });
}

/**
 * Hook to fetch unread notification count
 * Useful for badge displays
 *
 * Note: This query is only enabled when the user is authenticated
 */
export function useUnreadNotificationCount() {
  const { isAuthenticated, idToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.unread(),
    queryFn: () => notificationService.fetchUnreadCount(),
    enabled: isAuthenticated && !!idToken, // Only fetch when authenticated with valid token
    ...cacheConfig.notifications,
    // Refetch more frequently for real-time updates
    refetchInterval: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch notification settings
 */
export function useNotificationSettings() {
  return useQuery({
    queryKey: [...queryKeys.notifications.all(), "settings"],
    queryFn: () => notificationService.fetchSettings(),
    ...cacheConfig.notifications,
  });
}

/**
 * Mutation hook to create a notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Notification>) =>
      notificationService.createNotification(data),
    onSuccess: () => {
      // Invalidate notification list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(),
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread(),
      });
    },
  });
}

/**
 * Mutation hook to mark notification as read
 * Optimistically updates the notification state
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MarkNotificationReadRequest) =>
      notificationService.markAsRead(request),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.notifications.list(),
      });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(
        queryKeys.notifications.list()
      );

      // Optimistically update the notification
      queryClient.setQueryData(queryKeys.notifications.list(), (old: any) => {
        if (!old?.notifications) return old;

        return {
          ...old,
          notifications: old.notifications.map((notif: Notification) =>
            notif.id === variables.id ? { ...notif, read: true } : notif
          ),
          unread_count: Math.max(0, (old.unread_count || 0) - 1),
        };
      });

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          queryKeys.notifications.list(),
          context.previousNotifications
        );
      }
    },
    onSuccess: () => {
      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread(),
      });
    },
  });
}

/**
 * Mutation hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
    },
  });
}

/**
 * Mutation hook to delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate notification list
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(),
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread(),
      });
    },
  });
}

/**
 * Mutation hook to delete all notifications
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.deleteAllNotifications(),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
    },
  });
}

/**
 * Mutation hook to update notification settings
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) =>
      notificationService.updateSettings(settings),
    onSuccess: (updatedSettings) => {
      // Update the cache with new settings
      queryClient.setQueryData(
        [...queryKeys.notifications.all(), "settings"],
        updatedSettings
      );
    },
  });
}
