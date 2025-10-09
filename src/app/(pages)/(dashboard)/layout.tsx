// src/app/layout.tsx
"use client";

import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

import { usePathname, useRouter } from "next/navigation";

// WebSocket Context Provider & Hook
import { useWebSocket, socket } from "@/app/_lib/socket/socket";
import { updateNotificationState } from "@/redux_lib/features/notificationsSlice";

// Error Boundary Components
import { ErrorBoundary } from "@/app/_components/errors/ErrorBoundary";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/home/Home.module.scss";

// Redux (keeping for notifications temporarily)
import { useAppDispatch } from "@/redux_lib/hooks";
import { apiHTTPWrapper } from "@/redux_lib/features/authSlice";
import { setNotificationState } from "@/redux_lib/features/notificationsSlice";

// TanStack Query Auth
import { useAuth, useUserProfile } from "@/app/_lib/auth/useAuth";

// Component Imports
import NavigationBar from "@/app/_components/navigation/NavigationBar";
import Sidebar from "@/app/_components/navigation/Sidebar";

const routes = ["home", "explore", "profile", "vote", "notifications"];

// Create a context for sidebar state
interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggleSidebar: () => {},
  openSidebar: () => {},
  closeSidebar: () => {},
});

// Custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);

interface LayoutProps {
  children: ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);
  const pathname = usePathname();
  const router = useRouter();
  // Use TanStack Query auth instead of Redux
  const { idToken } = useAuth();
  const { profile: user } = useUserProfile();
  const { isConnected, joinRoom, leaveRoom } = useWebSocket();
  const dispatch = useAppDispatch();

  // Fetch notifications only once when component mounts, not on every route change
  useEffect(() => {
    const getNotifications = async () => {
      if (!idToken) return;

      try {
        const notificationResponse = await dispatch(
          apiHTTPWrapper({
            url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications/get/notifications`,
            idToken, // Use TanStack Query token
          })
        );

        if (notificationResponse.payload) {
          dispatch(
            setNotificationState(notificationResponse.payload.notifications)
          );
        } else {
          console.log("You don't have any notifications");
        }
      } catch (error) {
        console.error(
          `There was an error fetching your notifications: ${error}`
        );
      }
    };

    // Only fetch if we don't have notifications already
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    socket.on("receive_notification_update", (response) => {
      const notification = response;

      dispatch(updateNotificationState(notification));
    });

    return () => {
      socket.off("receive_notification_update");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Socket listeners should only be set up once

  // Join/leave WebSocket rooms based on user channel
  // Only runs when connection state or user channel changes
  useEffect(() => {
    if (!isConnected || !user?.current_channel) return;

    console.log("✅ WebSocket connected. Joining room:", user.current_channel);
    joinRoom(user.current_channel);

    return () => {
      console.log("🏁 Cleaning up. Leaving room:", user?.current_channel);
      if (!user?.current_channel) return;
      leaveRoom(user.current_channel);
    };
  }, [isConnected, user?.current_channel, joinRoom, leaveRoom]);

  // Prefetch routes on mount for faster navigation
  useEffect(() => {
    routes.forEach((route) => {
      const path = `/${route}`;
      router.prefetch(path);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only prefetch once on mount, not on every router change

  const shouldShowNavBar =
    !pathname?.includes("/timeline") &&
    !pathname?.includes("/notifications/view");

  return (
    <SidebarContext.Provider
      value={{
        isOpen: showSidebar,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      <div className={styles.onboardingWrapper}>
        {children}
        {shouldShowNavBar && <NavigationBar />}
        <Sidebar isOpen={showSidebar} onClose={closeSidebar} />
      </div>
    </SidebarContext.Provider>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Dashboard Layout Error:", error, errorInfo);
        // Could send to error monitoring service
      }}
    >
      <LayoutComponent>{children}</LayoutComponent>
    </ErrorBoundary>
  );
};

export default Layout;
