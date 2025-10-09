"use client";

import dynamic from "next/dynamic";

const NotificationView = dynamic(() => import("./NotificationView"), {
  ssr: false,
  loading: () => null,
});

export default function NotificationsPage() {
  return <NotificationView />;
}
