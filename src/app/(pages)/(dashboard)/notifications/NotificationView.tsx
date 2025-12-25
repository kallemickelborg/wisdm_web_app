"use client";

// System Imports
import React, { useEffect } from "react";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/notifications/Notifications.module.scss";

// Component Imports
import BaseHeader from "@/app/_components/header";
import BaseCard from "@/app/_components/cards/BaseCard";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowRightBrand from "@/assets/icons/arrow_right_brand.svg";

// Hooks
import { useNotifications } from "@/app/_lib/hooks";

const NotificationView = () => {
  const router = useRouter();

  // Fetch notifications using TanStack Query hook
  const { data: notificationsResponse, isLoading } = useNotifications();

  // Get notifications array from response
  const notifications = notificationsResponse?.notifications || [];

  return (
    <div className={styles.pageContainer}>
      <BaseHeader title="Notifications" variant="dashboard" />
      <div className={styles.pageWrapper}>
        {isLoading ? (
          <div className={styles.spinnerWrapper}>
            <LoadingOverlay />
          </div>
        ) : (
          <>
            {notifications.length ? (
              notifications.map((notification) => {
                const {
                  id,
                  action,
                  path,
                  message,
                  reference_id,
                  reference_type,
                } = notification;

                const extractPath = (
                  path: string,
                  keyword: string
                ): string | null => {
                  const regex = new RegExp(`${keyword}=([^?]*)`);
                  const match = path.match(regex);
                  return match ? match[1] : null;
                };

                const source_id =
                  extractPath(path, "id") || extractPath(path, "source_id");
                const newPath = `notifications/view?source_id=${source_id}&reference_id=${reference_id}&reference_type${reference_type}`;

                return (
                  <BaseCard
                    key={id}
                    variant="notification"
                    title={`🔔 ${action}`}
                    content={message}
                    onClick={() => router.push(newPath)}
                    actionIcon={
                      <Image
                        src={ArrowRightBrand}
                        alt="arrow-right-brand"
                        width={24}
                        height={24}
                      />
                    }
                  />
                );
              })
            ) : (
              <p>You have no notifications to display... Be more active</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationView;
