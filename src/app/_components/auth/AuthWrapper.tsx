/**
 * Authentication Wrapper using TanStack Query
 *
 * Replaces the Redux-based AuthWrapper with TanStack Query implementation
 * that provides persistent authentication, auto-redirect, and better UX.
 */

"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_lib/firebase/auth/auth";
import { useAuth, useUserProfile } from "@/app/_lib/auth/useAuth";
import { AuthData, UserProfile } from "@/app/_lib/auth/authStorage";
import { standardizePersonalRoomName } from "@/app/_lib/user/name/general";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";

interface AuthWrapperProps {
  children: ReactNode;
}

/**
 * Fetch user data from database
 */
async function fetchUserDataFromDB(idToken: string): Promise<UserProfile> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/users/get/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user data: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data) {
      throw new Error("API returned empty response");
    }

    // The API returns the user data directly in the response (not nested)
    // The response includes all user fields plus partial_data flag
    console.log("Fetched user data:", data);
    return data as UserProfile;
  } catch (error) {
    console.error("Error in fetchUserDataFromDB:", error);
    throw error;
  }
}

/**
 * Enhanced AuthWrapper with TanStack Query
 */
export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  // Remove searchParams - it's causing unnecessary re-renders on every navigation
  // const searchParams = useSearchParams();

  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
    idToken,
  } = useAuth();

  const {
    profile,
    isLoading: profileLoading,
    updateProfile,
  } = useUserProfile();

  // Handle Firebase auth state changes
  useEffect(() => {
    let isProcessing = false; // Prevent multiple simultaneous auth state changes

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isProcessing) {
        console.log("Auth state change already in progress, skipping...");
        return;
      }

      isProcessing = true;
      console.log(
        "Firebase auth state changed:",
        user ? "authenticated" : "not authenticated"
      );

      try {
        if (user) {
          try {
            // Get fresh token
            const idToken = await user.getIdToken();
            const tokenResult = await user.getIdTokenResult();

            // Create auth data
            const authData: AuthData = {
              idToken,
              expiresAt: new Date(tokenResult.expirationTime).getTime(),
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
            };

            // Login with new auth data
            login(authData);

            // Fetch user profile data
            try {
              const userData = await fetchUserDataFromDB(idToken);

              // Check if userData exists and is valid
              if (!userData) {
                throw new Error("User data is undefined or null");
              }

              // Generate personal channel name with null safety
              const personalChannelName = userData.username
                ? standardizePersonalRoomName(userData.username)
                : "";

              // Update profile with fetched data
              const profileData: UserProfile = {
                photo_url: userData.photo_url,
                current_channel:
                  userData.current_channel ?? personalChannelName,
                email: userData.email,
                locality: userData.locality,
                username: userData.username,
                name: userData.name,
                gender: userData.gender,
                created_at: userData.created_at,
                last_sign_in_time: userData.last_sign_in_time,
                disabled: userData.disabled,
                partial_data: userData.partial_data,
              };

              updateProfile(profileData);

              // Handle redirects based on user state
              handleAuthenticatedRedirect(userData, pathname);
            } catch (error) {
              console.error("Failed to fetch user data:", error);
              // Continue with authentication but without profile data
              handleAuthenticatedRedirect(null, pathname);
            }
          } catch (error) {
            console.error("Failed to process Firebase auth:", error);
            logout();
          }
        } else {
          // User is not authenticated in Firebase
          console.log("User not authenticated in Firebase");

          // Only clear auth data if we currently think user is authenticated
          if (isAuthenticated) {
            console.log("Clearing stale authentication data");
            logout();
          }
        }
      } finally {
        isProcessing = false;
      }
    });

    return unsubscribe;
    // Removed searchParams from dependencies - it was causing re-renders on every navigation
  }, [login, logout, updateProfile, pathname, router]);

  /**
   * Handle redirects for authenticated users
   */
  const handleAuthenticatedRedirect = (
    userData: UserProfile | null,
    currentPath: string | null
  ) => {
    if (userData?.partial_data) {
      console.log("User has partial data, redirecting to signup completion");
      router.push("/login/signup/personal");
    } else if (!isProtectedDashboardPath(currentPath)) {
      console.log("Redirecting authenticated user to home");
      router.push("/home");
    } else {
      // User is already on a dashboard path - no redirect needed
      console.log(
        `User already on dashboard path: ${currentPath} - no redirect needed`
      );
    }
  };

  /**
   * Check if a path is public (doesn't require authentication)
   */
  const isPublicPath = (path: string | null): boolean => {
    if (!path) return false;

    const publicPaths = [
      "/login",
      "/login/signin",
      "/login/signup",
      "/login/signup/personal",
      "/login/signup/interests",
      "/login/signup/complete",
    ];

    return publicPaths.some((publicPath) => path.startsWith(publicPath));
  };

  /**
   * Check if a path is a protected dashboard route
   */
  const isProtectedDashboardPath = (path: string | null): boolean => {
    if (!path) return false;

    const dashboardPaths = [
      "/home",
      "/explore",
      "/profile",
      "/vote",
      "/notifications",
      "/timeline",
    ];

    return dashboardPaths.some((dashboardPath) =>
      path.startsWith(dashboardPath)
    );
  };

  /**
   * Handle redirects for unauthenticated users
   */
  const handleUnauthenticatedRedirect = (currentPath: string | null) => {
    if (!isPublicPath(currentPath)) {
      console.log(
        "Unauthenticated user accessing protected route, redirecting to login"
      );
      router.push("/login");
    }
  };

  /**
   * Handle auto-redirect for authenticated users on login page
   */
  useEffect(() => {
    if (!authLoading && isAuthenticated && pathname?.startsWith("/login")) {
      console.log("Authenticated user on login page, redirecting to dashboard");
      router.push("/home");
    }
  }, [isAuthenticated, authLoading, pathname, router]);

  /**
   * Handle redirect for unauthenticated users on protected routes
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      handleUnauthenticatedRedirect(pathname);
    }
  }, [isAuthenticated, authLoading, pathname]);

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
