// Notification Service - ONLY functional methods that match backend

import { apiClient } from "./api/apiClient";
import { CrudOperations } from "./api/CrudOperations";
import type { Notification, NotificationResponse } from "@/models";

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

  createNotification: (data: Partial<Notification>) =>
    notificationCrud.create(data),

  markAsRead: (notificationId: string, isRead: boolean = true) =>
    notificationCrud.update(notificationId, { is_read: isRead }),

  deleteNotification: (notificationId: string) =>
    notificationCrud.delete(notificationId),
};
