// Category model matching backend Category entity
// Categories are referenced by ID in Timeline.category_ids
// Images are linked via the images table using parent_id

export interface Category {
  id: string;
  name: string;
  image_url?: string; // Image URL from images table or legacy column
  description?: string;
  created_at?: string;
  updated_at?: string;
}
