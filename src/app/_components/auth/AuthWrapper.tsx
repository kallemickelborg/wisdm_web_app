"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/_lib/hooks/useAuth";
import { useUserProfile } from "@/app/_lib/hooks";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";

interface AuthWrapperProps {
  children: ReactNode;
}

/**
 * AuthWrapper - Handles authentication-based routing and loading states
 *
 * Responsibilities:
 * - Redirect unauthenticated users to login page
 * - Redirect authenticated users away from login page
 * - Show loading states during auth check and profile fetch
 * - Handle partial signup completion redirects
 */
export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  /**
   * Check if a path is public (doesn't require authentication)
   */
  const isPublicPath = (path: string | null): boolean => {
    if (!path) return false;
    const publicPaths = ["/auth", "/auth/login", "/auth/signup"];
    return publicPaths.some((publicPath) => path.startsWith(publicPath));
  };

  /**
   * Redirect authenticated users with partial data to signup completion
   */
  useEffect(() => {
    if (!authLoading && isAuthenticated && profile?.partial_data) {
      router.push("/auth/signup/personal");
    }
  }, [isAuthenticated, authLoading, profile, router]);

  /**
   * Redirect authenticated users away from login page
   */
  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated &&
      pathname?.startsWith("/auth") &&
      !profile?.partial_data
    ) {
      router.push("/home");
    }
  }, [isAuthenticated, authLoading, pathname, profile, router]);

  /**
   * Redirect unauthenticated users to login page
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isPublicPath(pathname)) {
      router.push("/auth");
    }
  }, [isAuthenticated, authLoading, pathname, router]);

  // Show loading spinner during authentication check ONLY for protected routes
  if (authLoading && !isPublicPath(pathname)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <LoadingSpinner />
        <p style={{ color: "#666", fontSize: "14px" }}>
          Checking authentication...
        </p>
      </div>
    );
  }

  // Show loading spinner while fetching user profile (only for authenticated users on protected routes)
  if (
    isAuthenticated &&
    profileLoading &&
    !profile &&
    !isPublicPath(pathname)
  ) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <LoadingSpinner />
        <p style={{ color: "#666", fontSize: "14px" }}>
          Loading user profile...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
