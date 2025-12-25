/**
 * Authentication Hooks using TanStack Query
 *
 * Provides persistent authentication state management with automatic
 * token refresh, cross-tab synchronization, and proper error handling.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/_lib/firebase/auth/auth";
import {
  authStorage,
  userProfileStorage,
  authSyncUtils,
  AuthData,
  UserProfile,
} from "../auth/authStorage";
import { queryKeys, cacheConfig } from "../query/QueryProvider";

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthData["user"] | null;
  idToken: string | null;
  error: string | null;
}

/**
 * User profile state interface
 */
export interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch user profile data from API
 */
async function fetchUserProfile(idToken: string): Promise<UserProfile> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const response = await fetch(`${API_BASE_URL}/users/get/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Main authentication hook
 */
export function useAuth(): AuthState & {
  login: (authData: AuthData) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
} {
  const queryClient = useQueryClient();
  const router = useRouter();

  const firebaseAuthHandledRef = useRef(false);

  const lastRefreshAttemptRef = useRef<number>(0);

  // Query for authentication state
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.auth.token(),
    queryFn: () => {
      const stored = authStorage.getAuthData();
      if (!stored) return null;

      // NOTE: Do NOT trigger refresh mutation here!
      // This was causing infinite loops when the mutation failed.
      // Token refresh is now handled by a separate useEffect below.

      return stored;
    },
    ...cacheConfig.auth,
  });

  // Mutation for token refresh
  const refreshTokenMutation = useMutation({
    mutationFn: async (): Promise<AuthData> => {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe();

          if (!user) {
            reject(new Error("User not authenticated"));
            return;
          }

          try {
            const idToken = await user.getIdToken(true); // Force refresh
            const tokenResult = await user.getIdTokenResult();

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

            resolve(authData);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    onSuccess: (newAuthData) => {
      authStorage.saveAuthData(newAuthData);
      queryClient.setQueryData(queryKeys.auth.token(), newAuthData);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes("User not authenticated") ||
        errorMessage.includes("auth/") ||
        errorMessage.includes("403")
      ) {
        logout();
      }
    },
  });

  // Login function - stable reference to prevent useEffect re-runs
  const login = useCallback(
    (newAuthData: AuthData) => {
      authStorage.saveAuthData(newAuthData);
      queryClient.setQueryData(queryKeys.auth.token(), newAuthData);

      // Prefetch user profile
      queryClient.prefetchQuery({
        queryKey: queryKeys.user.profile(),
        queryFn: () => fetchUserProfile(newAuthData.idToken),
        ...cacheConfig.user,
      });
    },
    [queryClient]
  );

  // Logout function - stable reference to prevent useEffect re-runs
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
    }

    authStorage.clearAuthData();
    userProfileStorage.clearUserProfile();
    queryClient.clear(); // Clear all cached data

    router.push("/auth");
  }, [queryClient, router]);

  const refreshToken = useCallback(async () => {
    await refreshTokenMutation.mutateAsync();
  }, [refreshTokenMutation]);

  useEffect(() => {
    if (!authData || refreshTokenMutation.isPending) {
      return;
    }

    if (authStorage.needsRefresh()) {
      const now = Date.now();
      const timeSinceLastAttempt = now - lastRefreshAttemptRef.current;
      const MIN_REFRESH_INTERVAL = 5000;

      if (timeSinceLastAttempt < MIN_REFRESH_INTERVAL) {
        console.log(
          `⏳ Token refresh throttled - last attempt was ${timeSinceLastAttempt}ms ago`
        );
        return;
      }

      lastRefreshAttemptRef.current = now;

      const refreshTimeout = setTimeout(() => {
        if (authStorage.needsRefresh() && !refreshTokenMutation.isPending) {
          refreshTokenMutation.mutate();
        }
      }, 1000);

      return () => clearTimeout(refreshTimeout);
    }
  }, [authData, refreshTokenMutation]);

  useEffect(() => {
    const cleanup = authSyncUtils.onAuthChange((syncedAuthData) => {
      if (syncedAuthData) {
        queryClient.setQueryData(queryKeys.auth.token(), syncedAuthData);
      } else {
        queryClient.setQueryData(queryKeys.auth.token(), null);
        queryClient.clear();
      }
    });

    return cleanup;
  }, [queryClient]);

  // Firebase auth state listener - handles login/logout events
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Skip if this is the initial mount and we already have auth data
      // This prevents unnecessary re-authentication on page load
      if (firebaseAuthHandledRef.current && authData) {
        console.log(
          "⏭️ Skipping Firebase auth state change - already authenticated"
        );
        return;
      }

      if (user && !authData) {
        console.log("✅ Firebase user detected - logging in");
        firebaseAuthHandledRef.current = true;

        try {
          const idToken = await user.getIdToken();
          const tokenResult = await user.getIdTokenResult();

          const newAuthData: AuthData = {
            idToken,
            expiresAt: new Date(tokenResult.expirationTime).getTime(),
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
          };

          login(newAuthData);
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      } else if (!user && authData) {
        console.log("🚪 Firebase user logged out - clearing auth data");
        firebaseAuthHandledRef.current = false; // Reset so we can detect next login
        authStorage.clearAuthData();
        userProfileStorage.clearUserProfile();
        queryClient.setQueryData(queryKeys.auth.token(), null);
      } else {
        firebaseAuthHandledRef.current = true;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authData, login, queryClient]); // Include authData to detect changes

  return {
    isAuthenticated: !!authData,
    isLoading: isLoading || refreshTokenMutation.isPending,
    user: authData?.user || null,
    idToken: authData?.idToken || null,
    error: error?.message || refreshTokenMutation.error?.message || null,
    login,
    logout,
    refreshToken,
  };
}
