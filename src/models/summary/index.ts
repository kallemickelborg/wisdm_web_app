export interface Summary {
  id: string;
  parent_id: string;
  summary: string;
  version: number;
  created_at: string;
  updated_at?: string;
  is_deleted: boolean;
}
