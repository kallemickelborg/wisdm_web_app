export interface Vote {
  id: string;
  source_id: string;
  user_id: string;
  vote: boolean | null;
  saved: boolean;
  reference_type: string;
  created_at?: string;
  updated_at?: string;
  upvote_count?: number;
  downvote_count?: number;
}
