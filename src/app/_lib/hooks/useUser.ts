// User Hooks - ONLY functional hooks that match backend

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import { useAuth } from "./useAuth";
import { ApiError } from "@/services/api/apiClient";
import type { UserProfile } from "@/models";

/**
 * Fetch current user's profile
 * Backend: GET /api/users/get/user
 *
 * Note: This query is only enabled when the user is authenticated
 */
export function useUserProfile() {
  const { isAuthenticated, idToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => userService.fetchUserProfile(),
    enabled: isAuthenticated && !!idToken, // Only fetch when authenticated with valid token
    ...cacheConfig.user,
    retry: (failureCount, error) => {
      // Don't retry on 403 errors (invalid token)
      if (error instanceof ApiError && error.status === 403) {
        console.error("❌ 403 error - token is invalid");
        return false;
      }
      return false; // Don't retry user profile queries at all
    },
  });
}

/**
 * Mutation hook to create a user
 * Backend: POST /api/users/post/user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => userService.createUser(data),
    onSuccess: () => {
      // Invalidate user profile to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(),
      });
    },
  });
}

/**
 * Mutation hook to update user profile
 * Backend: PUT /api/users/put/user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserProfile> }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update user profile in cache
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser);
    },
  });
}

/**
 * Mutation hook to update user interests (categories)
 * Backend: PUT /api/users/put/user_interests
 */
export function useUpdateUserInterests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryIds: string[]) =>
      userService.updateUserInterests(categoryIds),
    onSuccess: async () => {
      // Invalidate user profile query (marks it as stale)
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.profile(),
      });

      // Force immediate refetch of user profile (ignores staleTime)
      await queryClient.refetchQueries({
        queryKey: queryKeys.user.profile(),
        type: "active", // Only refetch if query is currently being used
      });

      // Invalidate all timeline queries since they depend on user interests
      queryClient.invalidateQueries({
        queryKey: queryKeys.timelines.all(),
      });
    },
  });
}

/**
 * Mutation hook to delete user
 * Backend: DELETE /api/users/delete/user?id={id}
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      // Clear user data from cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.all(),
      });
    },
  });
}
