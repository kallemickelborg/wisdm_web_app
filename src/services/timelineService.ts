// Timeline Service - ONLY functional methods that match backend

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type { Timeline, TimelineResponse } from "@/models";

// CRUD operations for timelines
const timelineCrud = new CrudOperations<Timeline>({
  baseEndpoint: "/timelines",
  getEndpoint: "/timelines/get/timeline",
  getAllEndpoint: "/timelines/get/timelines",
  createEndpoint: "/timelines/post/timeline",
  updateEndpoint: "/timelines/put/timeline",
  deleteEndpoint: "/timelines/delete/timeline",
});

export const timelineService = {
  async fetchTimeline(timelineId: string): Promise<Timeline> {
    return timelineCrud.getById(timelineId);
  },

  async fetchTimelines(): Promise<Timeline[]> {
    const response = await apiClient.get<TimelineResponse>(
      `/timelines/get/timelines`
    );
    return response.timelines || [];
  },

  async fetchTimelinesByCategory(
    categoryId: string,
    filters?: { offset?: number; limit?: number }
  ): Promise<Timeline[]> {
    const queryParams = apiClient.buildQueryString({
      category_id: categoryId,
      offset: filters?.offset,
      limit: filters?.limit,
    });
    const response = await apiClient.get<TimelineResponse>(
      `/timelines/get/timelines_by_category${queryParams}`
    );
    return response.timelines || [];
  },

  async fetchTimelineById(timelineId: string): Promise<Timeline> {
    return this.fetchTimeline(timelineId);
  },

  async fetchTimelineDetails(timelineId: string): Promise<Timeline> {
    return this.fetchTimeline(timelineId);
  },

  async fetchFeaturedTimelines(limit: number = 10): Promise<Timeline[]> {
    const queryParams = apiClient.buildQueryString({ limit });
    const response = await apiClient.get<TimelineResponse>(
      `/timelines/get/featured${queryParams}`
    );
    return response.timelines || [];
  },

  async fetchTrendingTimelines(limit: number = 10): Promise<Timeline[]> {
    const queryParams = apiClient.buildQueryString({ limit });
    const response = await apiClient.get<TimelineResponse>(
      `/timelines/get/trending${queryParams}`
    );
    return response.timelines || [];
  },

  async createTimeline(data: Partial<Timeline>): Promise<Timeline> {
    return timelineCrud.create(data);
  },

  async updateTimeline(
    timelineId: string,
    data: Partial<Timeline>
  ): Promise<Timeline> {
    return timelineCrud.update(timelineId, data);
  },

  async deleteTimeline(
    timelineId: string
  ): Promise<{ message: string; id: string }> {
    return timelineCrud.delete(timelineId);
  },
};
