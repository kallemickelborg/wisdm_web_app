export interface Event {
  id: string;
  parent_id: string;
  event_index: number;
  title: string;
  body: string;
  narrative_bias: string;
  version: number;
  created_at: string;
  updated_at?: string;
  is_deleted: boolean;
}
