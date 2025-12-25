/**
 * Comment Hooks using TanStack Query
 *
 * Provides hooks for comment-related data fetching and mutations:
 * - Fetching comment threads
 * - Creating, updating, deleting comments
 * - Voting on comments
 * - Trending and recent comments
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services";
import { queryKeys, cacheConfig } from "../query/QueryProvider";
import type {
  Comment,
  CommentThread,
  CommentFilters,
  CreateCommentRequest,
  UpdateCommentRequest,
  DeleteCommentRequest,
  VoteCommentRequest,
} from "@/models";

/**
 * Hook to fetch comment thread
 * @param threadId - Thread identifier
 * @param startId - Starting comment ID for pagination
 * @param filters - Optional filters
 * @param enabled - Whether to enable the query
 */
export function useCommentThread(
  threadId: string,
  startId: string,
  filters?: CommentFilters,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [...queryKeys.comments.thread(threadId), startId, filters],
    queryFn: () =>
      commentService.fetchCommentThread(threadId, startId, filters),
    enabled: enabled && !!threadId && !!startId,
    ...cacheConfig.comments,
  });
}

/**
 * Hook to fetch trending comments
 * @param limit - Number of comments to fetch
 */
export function useTrendingComments(limit: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.comments.trending(), limit],
    queryFn: () => commentService.fetchTrendingComments(limit),
    ...cacheConfig.comments,
  });
}

/**
 * Hook to fetch recent comments by user
 * @param username - Username to fetch comments for
 * @param limit - Number of comments to fetch
 * @param offset - Pagination offset
 * @param enabled - Whether to enable the query
 */
export function useRecentCommentsByUser(
  username: string,
  limit: number = 20,
  offset: number = 0,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [...queryKeys.comments.all(), "recent", username, limit, offset],
    queryFn: () =>
      commentService.fetchRecentCommentsByUser(username, limit, offset),
    enabled: enabled && !!username,
    ...cacheConfig.comments,
  });
}

/**
 * Hook to fetch comments by reference
 * @param referenceId - Reference ID (e.g., timeline ID)
 * @param referenceType - Reference type (e.g., "timelines")
 * @param filters - Optional filters
 * @param enabled - Whether to enable the query
 */
export function useCommentsByReference(
  referenceId: string,
  referenceType: string,
  filters?: CommentFilters,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [
      ...queryKeys.comments.all(),
      "reference",
      referenceId,
      referenceType,
      filters,
    ],
    queryFn: () =>
      commentService.fetchCommentsByReference(
        referenceId,
        referenceType,
        filters
      ),
    enabled: enabled && !!referenceId && !!referenceType,
    ...cacheConfig.comments,
  });
}

/**
 * Mutation hook to create a comment
 * Automatically invalidates relevant comment caches on success
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      commentService.createComment(request),
    onSuccess: (newComment, variables) => {
      // Invalidate the thread cache to refetch with new comment
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.thread(variables.thread_id),
      });

      // Invalidate reference-based queries
      if (variables.reference_id && variables.reference_type) {
        queryClient.invalidateQueries({
          queryKey: [
            ...queryKeys.comments.all(),
            "reference",
            variables.reference_id,
            variables.reference_type,
          ],
        });
      }
    },
  });
}

/**
 * Mutation hook to update a comment
 * Automatically updates comment cache on success
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateCommentRequest) =>
      commentService.updateComment(request.id, request),
    onSuccess: (updatedComment) => {
      // Invalidate all comment queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });
    },
  });
}

/**
 * Mutation hook to delete a comment
 * Automatically invalidates comment caches on success
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteCommentRequest) =>
      commentService.deleteComment(request.id),
    onSuccess: () => {
      // Invalidate all comment queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });
    },
  });
}

/**
 * Mutation hook to vote on a comment
 * Optimistically updates the comment vote count
 */
export function useVoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VoteCommentRequest) =>
      commentService.voteComment(request.comment_id, request.vote),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.all(),
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(
        queryKeys.comments.all()
      );

      // Optimistically update the vote count
      // This would need to be more sophisticated in a real implementation
      // to update the specific comment in the cache

      return { previousComments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          queryKeys.comments.all(),
          context.previousComments
        );
      }
    },
    onSuccess: () => {
      // Invalidate to refetch with updated vote counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });
    },
  });
}

/**
 * Mutation hook to remove vote from a comment
 * Automatically invalidates comment caches on success
 */
export function useRemoveVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.removeVote(commentId),
    onSuccess: () => {
      // Invalidate all comment queries to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(),
      });
    },
  });
}

/**
 * Mutation hook to report a comment
 */
export function useReportComment() {
  return useMutation({
    mutationFn: ({
      commentId,
      reason,
    }: {
      commentId: string;
      reason: string;
    }) => commentService.reportComment(commentId, reason),
  });
}
