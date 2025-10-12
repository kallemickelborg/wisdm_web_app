// Trait model matching backend Trait entity
// Used for political/ideological traits in user profiles

export interface Trait {
  id: string;
  label: string;
  class_name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

