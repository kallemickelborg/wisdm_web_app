// Notification Service - ONLY functional methods that match backend

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type {
  Notification,
  NotificationResponse,
  NotificationSettings,
} from "@/models";

interface NotificationFilters {
  offset?: number;
  limit?: number;
}

// CRUD operations for notifications
const notificationCrud = new CrudOperations<Notification>({
  baseEndpoint: "/notifications",
  getEndpoint: "/notifications/get/notification",
  getAllEndpoint: "/notifications/get/notifications",
  createEndpoint: "/notifications/post/notification",
  updateEndpoint: "/notifications/put/notification",
  deleteEndpoint: "/notifications/delete/notification",
});

export const notificationService = {
  async fetchNotifications(
    filters?: NotificationFilters
  ): Promise<NotificationResponse> {
    const queryParams = apiClient.buildQueryString({
      offset: filters?.offset || 0,
      limit: filters?.limit || 20,
    });

    const response = await apiClient.get<{
      notifications: Record<string, Notification>;
    }>(`/notifications/get/notifications${queryParams}`);

    const notificationsArray = Object.values(response.notifications || {});

    return {
      notifications: notificationsArray,
      total: notificationsArray.length,
      unread: notificationsArray.filter((n) => !n.is_read).length,
    };
  },

  async fetchUnreadCount(): Promise<number> {
    const response = await this.fetchNotifications({ limit: 100 });
    return response.unread;
  },

  async fetchSettings(): Promise<NotificationSettings> {
    return apiClient.get<NotificationSettings>("/notifications/settings");
  },

  async updateSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    return apiClient.put<NotificationSettings>(
      "/notifications/settings",
      settings
    );
  },

  createNotification: (data: Partial<Notification>) =>
    notificationCrud.create(data),

  markAsRead: (notificationId: string, isRead: boolean = true) =>
    notificationCrud.update(notificationId, { is_read: isRead }),

  async markAllAsRead(): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(
      "/notifications/mark_all_read",
      {}
    );
  },

  deleteNotification: (notificationId: string) =>
    notificationCrud.delete(notificationId),

  async deleteAllNotifications(): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>("/notifications/delete_all");
  },
};
