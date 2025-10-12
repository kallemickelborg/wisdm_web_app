/**
 * Event Data Hooks using TanStack Query
 *
 * Provides hooks for event-related data fetching and mutations:
 * - Fetching events by parent timeline
 * - Creating, updating, and deleting events
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/services";
import type { Event } from "@/models";

// Query keys for events
const eventKeys = {
  all: () => ["events"] as const,
  lists: () => [...eventKeys.all(), "list"] as const,
  list: (filters?: any) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all(), "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  byParent: (parentId: string) => [...eventKeys.all(), "byParent", parentId] as const,
};

/**
 * Hook to fetch a single event by ID
 * @param eventId - Event identifier
 */
export function useEvent(eventId: string) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventService.fetchEvent(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch events by parent timeline
 * @param parentId - Parent timeline identifier
 */
export function useEventsByParent(parentId: string) {
  return useQuery({
    queryKey: eventKeys.byParent(parentId),
    queryFn: () => eventService.fetchEventsByParent(parentId),
    enabled: !!parentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Mutation hook to create an event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Event>) => eventService.createEvent(data),
    onSuccess: (newEvent) => {
      // Invalidate parent timeline's events
      if (newEvent.parent_id) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.byParent(newEvent.parent_id),
        });
      }

      // Invalidate all events list
      queryClient.invalidateQueries({
        queryKey: eventKeys.lists(),
      });
    },
  });
}

/**
 * Mutation hook to update an event
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventService.updateEvent(id, data),
    onSuccess: (updatedEvent) => {
      // Update the specific event in cache
      queryClient.setQueryData(
        eventKeys.detail(updatedEvent.id),
        updatedEvent
      );

      // Invalidate parent timeline's events
      if (updatedEvent.parent_id) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.byParent(updatedEvent.parent_id),
        });
      }
    },
  });
}

/**
 * Mutation hook to delete an event (soft delete)
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      // Invalidate all event queries
      queryClient.invalidateQueries({
        queryKey: eventKeys.all(),
      });
    },
  });
}

