export interface Timeline {
  id: string;
  title: string;
  parent_event_id: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  category_ids: string[];
  root_comment_count: number;
  comment_count_total: number;
  upvote_count: number;
  downvote_count: number;
  vote?: boolean | null;
}

export interface TimelineResponse {
  timelines: Timeline[];
}
