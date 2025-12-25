// src/app/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

// WebSocket Context Provider & Hook
import { useWebSocket, socket } from "@/app/_lib/socket/socket";
import { useWebSocketChannel } from "@/app/_contexts/WebSocketChannelContext";

// Sidebar Context
import { SidebarContext } from "@/app/_contexts/SidebarContext";

// Error Boundary Components
import { ErrorBoundary } from "@/app/_components/errors/ErrorBoundary";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/home/Home.module.scss";

// TanStack Query Hooks
import { useUserProfile, useNotifications } from "@/app/_lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/_lib/query/QueryProvider";

// Component Imports
import { BaseFooter } from "@/app/_components/footer";
import Sidebar from "@/app/_components/navigation/Sidebar";

const routes = ["home", "explore", "profile", "vote", "notifications"];

interface LayoutProps {
  children: ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useUserProfile();
  const { isConnected, joinRoom, leaveRoom } = useWebSocket();
  const { currentChannel } = useWebSocketChannel();
  const queryClient = useQueryClient();

  // Prevent hydration mismatch by only rendering client-side components after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch notifications using TanStack Query hook
  const { data: notificationsResponse } = useNotifications();

  // Handle WebSocket notification updates
  useEffect(() => {
    if (!socket) return; // Guard against null socket

    socket.on("receive_notification_update", (notification) => {
      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list(),
      });
    });

    return () => {
      if (!socket) return;
      socket.off("receive_notification_update");
    };
  }, [queryClient]);

  // Join/leave WebSocket rooms based on current channel
  // Only runs when connection state or current channel changes
  useEffect(() => {
    if (!isConnected || !currentChannel) return;

    console.log("✅ WebSocket connected. Joining room:", currentChannel);
    joinRoom(currentChannel);

    return () => {
      console.log("🏁 Cleaning up. Leaving room:", currentChannel);
      if (!currentChannel) return;
      leaveRoom(currentChannel);
    };
  }, [isConnected, currentChannel, joinRoom, leaveRoom]);

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
      <div className={styles.onboardingWrapper} suppressHydrationWarning>
        {children}
        {shouldShowNavBar && <BaseFooter variant="dashboard" />}
        {/* Only render Sidebar after client-side mount to prevent hydration mismatch */}
        {isMounted && <Sidebar isOpen={showSidebar} onClose={closeSidebar} />}
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
