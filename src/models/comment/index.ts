export interface Comment {
  id: string;
  body: string;
  created_at: string;
  updated_at?: string;
  username?: string;
  user_id?: string;
  parent_id: string;
  thread_id: string;
  reference_id?: string;
  reference_type?: string;
  index: number;
  is_deleted: boolean;
  upvote_count: number;
  downvote_count: number;
  comment_count?: number;
  vote?: boolean | null;
  user_photo_url?: string;
  root_comment_count?: number;
  comment_index?: number; // Used in reducer for indexing
  is_vote_bouncing?: boolean; // UI state for vote animation
}

export interface UpdateComment extends Partial<Comment> {
  id: string;
  parent_id?: string;
  comment_index?: number;
}

export interface CommentsByParentId {
  [parent_id: string]: {
    [index_name: string]: Comment;
  };
}

export interface CommentGroupByIndex {
  [index: string]: Comment;
}

export interface CommentThread {
  comments_by_parent?: Record<string, Comment[]>;
  comments_by_index?: Record<number, Comment>;
  comments?: CommentsByParentId & { root?: Comment };
  root_comment_count?: number;
  start_id?: string;
}

export interface TrendingComment extends Comment {
  vote_count: number; // Net vote count (upvotes - downvotes)
  timeline_title?: string; // Title of the timeline the comment belongs to
}

export interface CommentFilters {
  order_by?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  reference_type?: string;
}

export interface CreateCommentRequest {
  body: string;
  parent_id?: string;
  thread_id: string;
  reference_id?: string;
  reference_type?: string;
}

export interface UpdateCommentRequest {
  id: string;
  body?: string;
}

export interface DeleteCommentRequest {
  id: string;
  thread_id: string;
}

export interface VoteCommentRequest {
  comment_id: string;
  vote: boolean | null;
}
