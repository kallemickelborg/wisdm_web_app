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
}

export interface CommentThread {
  comments_by_parent: Record<string, Comment[]>;
  comments_by_index: Record<number, Comment>;
}
