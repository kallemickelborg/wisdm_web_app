"use client";

// System Imports
import React, { useEffect } from "react";

// API/Database Imports
import { useAppSelector } from "@/redux_lib/hooks";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/notifications/Notifications.module.scss";

// Component Imports
import BaseHeader from "@/app/_components/header";
import BaseCard from "@/app/_components/cards/BaseCard";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";
import { notificationMessage } from "@/app/_lib/helper/response/notifications";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowRightBrand from "@/assets/icons/arrow_right_brand.svg";

const NotificationView = () => {
  const notifications = useAppSelector((state) => state.notifications);
  const { isLoading, setLoaded } = useLoadingState(["notifications"]);
  const router = useRouter();

  useEffect(() => {
    //  This basically does nothing and I hate it CHANGE IT!!!!!!!🔥🐶💩...
    const fetchNotifications = async () => {
      try {
      } finally {
        setLoaded("notifications");
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <BaseHeader title="Notifications" variant="dashboard" />
      <div className={styles.pageWrapper}>
        {isLoading ? (
          <div className={styles.spinnerWrapper}>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {Object.values(notifications).length ? (
              Object.entries(notifications).map(([key, notification]) => {
                const {
                  count,
                  action,
                  created_at,
                  path,
                  username,
                  is_read,
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
                    key={key}
                    variant="notification"
                    title={`🔔 ${action}`}
                    content={notificationMessage(
                      username,
                      count,
                      action,
                      created_at
                    )}
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
