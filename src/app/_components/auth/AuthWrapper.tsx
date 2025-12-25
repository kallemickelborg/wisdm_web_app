"use client";

import { useEffect, ReactNode, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/_lib/hooks/useAuth";
import { useUserProfile } from "@/app/_lib/hooks";
import { ApiError } from "@/services/api/apiClient";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { authStorage } from "@/app/_lib/auth/authStorage";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();

  // Prevent infinite logout loops
  const logoutInProgressRef = useRef(false);

  // Optimistic auth check - synchronously check storage for immediate routing
  // This prevents the URL from lingering on /auth while the async query loads
  const [hasStoredAuth] = useState(() => {
    if (typeof window === "undefined") return false;
    return authStorage.isAuthenticated();
  });

  /**
   * Check if a path is public (doesn't require authentication)
   */
  const isPublicPath = (path: string | null): boolean => {
    if (!path) return false;
    const publicPaths = ["/auth", "/auth/login", "/auth/signup"];
    return publicPaths.some((publicPath) => path.startsWith(publicPath));
  };

  /**
   * Handle 403 errors by logging out the user
   * Uses a ref to prevent infinite logout loops
   */
  useEffect(() => {
    if (profileError && !logoutInProgressRef.current) {
      // Check if it's an ApiError with 403 status
      const is403Error =
        (profileError instanceof ApiError && profileError.status === 403) ||
        (profileError as any)?.status === 403;

      if (is403Error) {
        console.error("❌ 403 error detected in AuthWrapper - logging out");
        logoutInProgressRef.current = true;
        logout();
      }
    }
  }, [profileError, logout]);

  /**
   * Redirect authenticated users with partial data to signup completion
   * This takes priority over other redirects
   */
  useEffect(() => {
    if (
      !authLoading &&
      !profileLoading &&
      isAuthenticated &&
      profile?.partial_data &&
      !pathname?.startsWith("/auth/signup")
    ) {
      console.log(
        "🔄 User has partial data - redirecting to complete onboarding"
      );
      router.push("/auth/signup/personal");
    }
  }, [isAuthenticated, authLoading, profileLoading, profile, pathname, router]);

  /**
   * Redirect authenticated users away from login page
   */
  useEffect(() => {
    if (
      !authLoading &&
      !profileLoading &&
      isAuthenticated &&
      pathname?.startsWith("/auth") &&
      !pathname?.startsWith("/auth/signup") &&
      !profile?.partial_data
    ) {
      router.push("/home");
    }
  }, [isAuthenticated, authLoading, profileLoading, pathname, profile, router]);

  /**
   * Redirect unauthenticated users to login page
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isPublicPath(pathname)) {
      router.push("/auth");
    }
  }, [isAuthenticated, authLoading, pathname, router]);

  // Show loading spinner during authentication check ONLY for protected routes
  // BUT: If we have stored auth, skip the loading spinner and let the user through
  // This prevents the URL from staying on /auth while the query loads
  if (authLoading && !isPublicPath(pathname) && !hasStoredAuth) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingOverlay
          size="large"
          variant="logo"
          text="Checking authentication..."
        />
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
      <div className={styles.loadingContainer}>
        <LoadingOverlay
          size="large"
          variant="logo"
          text="Loading user profile..."
        />
      </div>
    );
  }

  // Show loading spinner if user has partial data and we're redirecting
  if (
    isAuthenticated &&
    profile?.partial_data &&
    !pathname?.startsWith("/auth/signup")
  ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingOverlay
          size="large"
          variant="logo"
          text="Redirecting to complete onboarding..."
        />
      </div>
    );
  }

  return <>{children}</>;
}
