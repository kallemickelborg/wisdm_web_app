// TODO: Unused

import { apiClient } from "./api/apiClient";
import type {
  SearchResult,
  SearchQuery,
  SearchResponse,
  SearchSuggestion,
  RecentSearch,
} from "@/models";

export const searchService = {
  /**
   * Perform global search
   * @param query - Search query parameters
   * @returns Search results
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    const queryParams = apiClient.buildQueryString({
      q: query.query,
      type: query.type,
      category: query.category,
      offset: query.offset || 0,
      limit: query.limit || 20,
      sort_by: query.sort_by || "relevance",
      sort_order: query.sort_order || "DESC",
    });

    return apiClient.get<SearchResponse>(`/search${queryParams}`);
  },

  /**
   * Search timelines only
   * @param query - Search query string
   * @param limit - Number of results
   * @returns Array of timeline search results
   */
  async searchTimelines(
    query: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    const response = await this.search({
      query,
      type: "timeline",
      limit,
    });
    return response.results || [];
  },

  /**
   * Search comments only
   * @param query - Search query string
   * @param limit - Number of results
   * @returns Array of comment search results
   */
  async searchComments(
    query: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    const response = await this.search({
      query,
      type: "comment",
      limit,
    });
    return response.results || [];
  },

  /**
   * Search users only
   * @param query - Search query string
   * @param limit - Number of results
   * @returns Array of user search results
   */
  async searchUsers(
    query: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    const response = await this.search({
      query,
      type: "user",
      limit,
    });
    return response.results || [];
  },

  /**
   * Get search suggestions/autocomplete
   * @param query - Partial search query
   * @param limit - Number of suggestions
   * @returns Array of search suggestions
   */
  async getSuggestions(
    query: string,
    limit: number = 5
  ): Promise<SearchSuggestion[]> {
    const queryParams = apiClient.buildQueryString({
      q: query,
      limit,
    });
    const response = await apiClient.get<{ suggestions: SearchSuggestion[] }>(
      `/search/suggestions${queryParams}`
    );
    return response.suggestions || [];
  },

  /**
   * Get recent searches for current user
   * @param limit - Number of recent searches
   * @returns Array of recent searches
   */
  async getRecentSearches(limit: number = 10): Promise<RecentSearch[]> {
    const queryParams = apiClient.buildQueryString({ limit });
    const response = await apiClient.get<{ searches: RecentSearch[] }>(
      `/search/recent${queryParams}`
    );
    return response.searches || [];
  },

  /**
   * Clear recent searches
   * @returns Success response
   */
  async clearRecentSearches(): Promise<{ success: boolean; message: string }> {
    return apiClient.delete("/search/recent");
  },
};
