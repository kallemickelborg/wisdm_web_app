export interface Event {
  id: string;
  parent_id: string;
  event_index: number;
  title: string;
  body: string;
  narrative_bias: "left" | "right";
  version: number;
  created_at: string;
  updated_at?: string;
  is_deleted: boolean;
  date?: string;
  left_perspective?: string;
  right_perspective?: string;
  sources?: string[];
  left_sources?: string[];
  right_sources?: string[];
}
