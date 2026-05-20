export interface NotificationData {
  id: string;
  deviceId: string;
  type: "warning" | "danger" | "info";
  message: string;
  isRead: boolean;
  createdAt: string;
}
