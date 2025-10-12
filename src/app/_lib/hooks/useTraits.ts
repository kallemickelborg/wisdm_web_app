/**
 * Trait Data Hooks using TanStack Query
 *
 * Provides hooks for trait-related data fetching and mutations:
 * - Fetching political/ideological traits
 * - Creating, updating, and deleting traits (admin only)
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { traitService } from "@/services";
import type { Trait } from "@/models";

// Query keys for traits
const traitKeys = {
  all: () => ["traits"] as const,
  lists: () => [...traitKeys.all(), "list"] as const,
  list: (filters?: any) => [...traitKeys.lists(), filters] as const,
  details: () => [...traitKeys.all(), "detail"] as const,
  detail: (id: string) => [...traitKeys.details(), id] as const,
};

/**
 * Hook to fetch all traits
 */
export function useTraits() {
  return useQuery({
    queryKey: traitKeys.lists(),
    queryFn: () => traitService.fetchTraits(),
    staleTime: 5 * 60 * 1000, // 5 minutes - traits rarely change
  });
}

/**
 * Hook to fetch a single trait by ID
 * @param traitId - Trait identifier
 */
export function useTrait(traitId: string) {
  return useQuery({
    queryKey: traitKeys.detail(traitId),
    queryFn: () => traitService.fetchTrait(traitId),
    enabled: !!traitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Mutation hook to create a trait (admin only)
 */
export function useCreateTrait() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Trait>) => traitService.createTrait(data),
    onSuccess: () => {
      // Invalidate traits list to refetch
      queryClient.invalidateQueries({
        queryKey: traitKeys.lists(),
      });
    },
  });
}

/**
 * Mutation hook to update a trait (admin only)
 */
export function useUpdateTrait() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trait> }) =>
      traitService.updateTrait(id, data),
    onSuccess: (updatedTrait) => {
      // Update the specific trait in cache
      queryClient.setQueryData(traitKeys.detail(updatedTrait.id), updatedTrait);

      // Invalidate traits list
      queryClient.invalidateQueries({
        queryKey: traitKeys.lists(),
      });
    },
  });
}

/**
 * Mutation hook to delete a trait (admin only)
 */
export function useDeleteTrait() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (traitId: string) => traitService.deleteTrait(traitId),
    onSuccess: () => {
      // Invalidate all trait queries
      queryClient.invalidateQueries({
        queryKey: traitKeys.all(),
      });
    },
  });
}

