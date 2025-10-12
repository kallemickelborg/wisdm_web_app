// Matches WisdmNewsAPI/utils/classes/users.py

import type { Trait, Category } from "@/models";

export interface UserProfile {
  username?: string;
  locality?: string;
  photo_url?: string;
  name?: string;
  email?: string;
  gender?: string;
  created_at?: string;
  last_sign_in_time?: string;
  disabled?: boolean;
  partial_data?: boolean;
  current_channel?: string;
  traits?: Trait[]; // Now returns full Trait objects
  interests?: Category[]; // Now returns full Category objects
}

export interface UserTraitsResponse {
  traits: Trait[];
}

export interface UserInterestsResponse {
  interests: Category[];
}
