// Utility Service - Helper functions from backend

import { apiClient } from "./api/apiClient";

export const utilityService = {
  async validateName(
    name: string
  ): Promise<{ valid: boolean; error: string | null }> {
    return apiClient.post<{ valid: boolean; error: string | null }>(
      "/utilities/post/validate_name",
      { name }
    );
  },

  async validateUsername(
    username: string
  ): Promise<{ valid: boolean; error: string | null }> {
    return apiClient.post<{ valid: boolean; error: string | null }>(
      "/utilities/post/validate_username",
      { username }
    );
  },

  async getElapsedTime(timestamp: string): Promise<{ elapsed_time: string }> {
    return apiClient.post<{ elapsed_time: string }>(
      "/utilities/post/elapsed_time",
      { timestamp }
    );
  },

  async formatNotificationMessage(
    username: string,
    count: number,
    action: string,
    created_at: string
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      "/utilities/post/notification_message",
      { username, count, action, created_at }
    );
  },
};
