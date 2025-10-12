export interface Notification {
  id: string;
  reference_id: string;
  reference_type?: string;
  action: string;
  path: string;
  username: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  table_name?: string;
  is_deleted?: boolean;
  count?: number; // Number of aggregated notifications
  message?: string; // Formatted message from backend
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unread: number;
}
