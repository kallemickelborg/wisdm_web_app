// Image model matching backend Image entity
// Images are linked to parent entities (categories, timelines, etc.) via parent_id array

export interface Image {
  id: string;
  image_url: string;
  parent_id?: string[]; // Array of parent entity IDs
}

