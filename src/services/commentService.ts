// Comment Service - ONLY functional methods that match backend

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type { Comment, CommentThread, TrendingComment } from "@/models";

interface CommentFilters {
  order_by?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  reference_type?: string;
}

// CRUD operations for comments
const commentCrud = new CrudOperations<Comment>({
  baseEndpoint: "/comments",
  getEndpoint: "/comments/get/comment",
  getAllEndpoint: "/comments/get/comments",
  createEndpoint: "/comments/post/comment",
  updateEndpoint: "/comments/put/comment",
  deleteEndpoint: "/comments/delete/comment",
});

export const commentService = {
  /**
   * Fetch comment thread
   * Backend: GET /api/comments/get/get_comment_thread
   */
  async fetchCommentThread(
    threadId: string,
    startId: string,
    filters?: CommentFilters
  ): Promise<CommentThread> {
    const queryParams = apiClient.buildQueryString({
      thread_id: threadId,
      start_id: startId,
      order_by: filters?.order_by || "DESC",
      offset: filters?.offset || 0,
      limit: filters?.limit || 20,
      reference_type: filters?.reference_type || "timelines",
    });

    return apiClient.get<CommentThread>(
      `/comments/get/get_comment_thread${queryParams}`
    );
  },

  /**
   * Fetch trending comments
   * Backend: GET /api/comments/get_trending
   */
  async fetchTrendingComments(limit: number = 10): Promise<TrendingComment[]> {
    const queryParams = apiClient.buildQueryString({ limit });
    const response = await apiClient.get<{ comments: TrendingComment[] }>(
      `/comments/get_trending${queryParams}`
    );
    return response.comments || [];
  },

  /**
   * Fetch recent comments by user
   * Backend: GET /api/comments/get_recent
   */
  async fetchRecentCommentsByUser(
    username: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Comment[]> {
    const queryParams = apiClient.buildQueryString({
      username,
      limit,
      offset,
    });
    const response = await apiClient.get<{ comments: Comment[] }>(
      `/comments/get_recent${queryParams}`
    );
    return response.comments || [];
  },

  /**
   * Fetch comments by reference (e.g., timeline, event)
   * Backend: GET /api/comments/get/comments
   */
  async fetchCommentsByReference(
    referenceId: string,
    referenceType: string,
    filters?: CommentFilters
  ): Promise<Comment[]> {
    const queryParams = apiClient.buildQueryString({
      reference_id: referenceId,
      reference_type: referenceType,
      order_by: filters?.order_by || "DESC",
      offset: filters?.offset || 0,
      limit: filters?.limit || 20,
    });
    const response = await apiClient.get<{ comments: Comment[] }>(
      `/comments/get/comments${queryParams}`
    );
    return response.comments || [];
  },

  /**
   * Create new comment
   * Backend: POST /api/comments/post/comment
   */
  async createComment(data: Partial<Comment>): Promise<Comment> {
    return commentCrud.create(data);
  },

  /**
   * Update existing comment
   * Backend: PUT /api/comments/put/comment
   */
  async updateComment(
    commentId: string,
    data: Partial<Comment>
  ): Promise<Comment> {
    return commentCrud.update(commentId, data);
  },

  /**
   * Delete comment
   * Backend: DELETE /api/comments/delete/comment?id={id}
   */
  async deleteComment(
    commentId: string
  ): Promise<{ message: string; id: string }> {
    return commentCrud.delete(commentId);
  },

  /**
   * Vote on a comment
   * Backend: POST /api/votes/post/vote
   */
  async voteComment(commentId: string, vote: boolean | null): Promise<Comment> {
    return apiClient.post<Comment>("/votes/post/vote", {
      comment_id: commentId,
      vote,
    });
  },

  /**
   * Remove vote from a comment
   * Backend: DELETE /api/votes/delete/vote
   */
  async removeVote(commentId: string): Promise<{ message: string }> {
    const queryParams = apiClient.buildQueryString({
      comment_id: commentId,
    });
    return apiClient.delete<{ message: string }>(
      `/votes/delete/vote${queryParams}`
    );
  },

  /**
   * Report a comment
   * Backend: POST /api/comments/report
   */
  async reportComment(
    commentId: string,
    reason: string
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/comments/report", {
      comment_id: commentId,
      reason,
    });
  },
};
