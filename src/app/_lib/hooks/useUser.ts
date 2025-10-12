// User Hooks - ONLY functional hooks that match backend

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import { useAuth } from "./useAuth";
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
