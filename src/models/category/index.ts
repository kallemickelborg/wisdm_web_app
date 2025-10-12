// No backend class exists - categories table in database only
// Categories are referenced by ID in Timeline.category_ids

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
