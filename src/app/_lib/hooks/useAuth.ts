/**
 * Authentication Hooks using TanStack Query
 *
 * Provides persistent authentication state management with automatic
 * token refresh, cross-tab synchronization, and proper error handling.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
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
  // Backend returns user data directly, not nested in a 'user' field
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

  // Query for authentication state
  const {
    data: authData,
    isLoading,
    error,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: queryKeys.auth.token(),
    queryFn: () => {
      const stored = authStorage.getAuthData();
      if (!stored) return null;

      // Check if token needs refresh
      if (authStorage.needsRefresh()) {
        // Trigger refresh in background
        refreshTokenMutation.mutate();
      }

      return stored;
    },
    ...cacheConfig.auth,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
      console.error("Token refresh failed:", error);
      logout();
    },
  });

  // Login function
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

  // Logout function
  const logout = useCallback(() => {
    authStorage.clearAuthData();
    userProfileStorage.clearUserProfile();
    queryClient.clear(); // Clear all cached data
    router.push("/auth");
  }, [queryClient, router]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    await refreshTokenMutation.mutateAsync();
  }, [refreshTokenMutation]);

  // Cross-tab synchronization
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

  // Firebase auth state listener (for initial setup and external changes)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !authData) {
        // User is authenticated in Firebase but not in our cache
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
        // User is not authenticated in Firebase but we have cached data
        logout();
      }
    });

    return unsubscribe;
  }, [authData, login, logout]);

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

/**
 * User profile hook
 *
 * @deprecated This hook is deprecated. Use `useUserProfile` from '@/app/_lib/hooks' instead.
 * This version conflicts with the service-based hooks and causes duplicate queries.
 *
 * REMOVED: This function has been removed to prevent conflicts with the new service-based hooks.
 * All components should now use: import { useUserProfile } from '@/app/_lib/hooks';
 */
// export function useUserProfile(): UserProfileState & {
//   updateProfile: (updates: Partial<UserProfile>) => void;
//   refetchProfile: () => void;
// } {
//   ... (removed to prevent conflicts)
// }

/**
 * Authentication redirect hook
 */
export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const redirectToLogin = useCallback(() => {
    router.push("/auth");
  }, [router]);

  const redirectToDashboard = useCallback(() => {
    router.push("/home");
  }, [router]);

  const redirectIfAuthenticated = useCallback(
    (targetPath: string = "/home") => {
      if (isAuthenticated && !isLoading) {
        router.push(targetPath);
        return true;
      }
      return false;
    },
    [isAuthenticated, isLoading, router]
  );

  const redirectIfNotAuthenticated = useCallback(
    (targetPath: string = "/auth") => {
      if (!isAuthenticated && !isLoading) {
        router.push(targetPath);
        return true;
      }
      return false;
    },
    [isAuthenticated, isLoading, router]
  );

  return {
    redirectToLogin,
    redirectToDashboard,
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
  };
}

/**
 * Protected route hook
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const { redirectIfNotAuthenticated } = useAuthRedirect();

  useEffect(() => {
    if (!isLoading) {
      redirectIfNotAuthenticated();
    }
  }, [isAuthenticated, isLoading, redirectIfNotAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    canAccess: isAuthenticated && !isLoading,
  };
}
