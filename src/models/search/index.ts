/**
 * Search-related types and interfaces
 */

export interface SearchQuery {
  query: string;
  type?: "timeline" | "comment" | "user" | "topic";
  category?: string;
  offset?: number;
  limit?: number;
  sort_by?: "relevance" | "date" | "popularity";
  sort_order?: "ASC" | "DESC";
}

export interface SearchResult {
  id: string;
  type: "timeline" | "comment" | "user" | "topic";
  title: string;
  description?: string;
  url?: string;
  image?: string;
  created_at?: string;
  relevance_score?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  offset: number;
  limit: number;
  query: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: "query" | "timeline" | "topic" | "user";
  relevance_score?: number;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  result_count: number;
}

