// TODO: REMOVE THIS FILE

/**
 * Authentication Storage Utilities
 *
 * Handles persistent storage of authentication state with proper
 * security considerations and cross-tab synchronization.
 */

export interface AuthData {
  idToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
}

export interface UserProfile {
  photo_url: string | null;
  current_channel: string | null;
  email: string | null;
  locality: string | null;
  username: string | null;
  name: string | null;
  gender: string | null;
  created_at: string | null;
  last_sign_in_time: string | null;
  disabled: boolean | null;
  partial_data: boolean | null;
  traits: string[] | null;
}

const AUTH_STORAGE_KEY = "wisdm_auth_data";
const USER_PROFILE_STORAGE_KEY = "wisdm_user_profile";
const AUTH_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer before expiry

/**
 * Storage utilities with error handling
 */
const storage = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to read from localStorage: ${error}`);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to write to localStorage: ${error}`);
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove from localStorage: ${error}`);
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) {
      console.warn(`Failed to clear localStorage: ${error}`);
    }
  },
};

/**
 * Authentication data storage
 */
export const authStorage = {
  /**
   * Save authentication data to localStorage
   */
  saveAuthData: (authData: AuthData): void => {
    try {
      const serialized = JSON.stringify(authData);
      storage.set(AUTH_STORAGE_KEY, serialized);

      // Dispatch storage event for cross-tab synchronization
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: AUTH_STORAGE_KEY,
            newValue: serialized,
            storageArea: localStorage,
          })
        );
      }
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  },

  /**
   * Get authentication data from localStorage
   */
  getAuthData: (): AuthData | null => {
    try {
      const stored = storage.get(AUTH_STORAGE_KEY);
      if (!stored) return null;

      const authData: AuthData = JSON.parse(stored);

      // Check if token is expired (with buffer)
      if (Date.now() >= authData.expiresAt - AUTH_EXPIRY_BUFFER) {
        console.log("Stored auth token is expired, removing...");
        authStorage.clearAuthData();
        return null;
      }

      return authData;
    } catch (error) {
      console.error("Failed to parse stored auth data:", error);
      authStorage.clearAuthData(); // Clear corrupted data
      return null;
    }
  },

  /**
   * Clear authentication data
   */
  clearAuthData: (): void => {
    storage.remove(AUTH_STORAGE_KEY);
    storage.remove(USER_PROFILE_STORAGE_KEY);

    // Dispatch storage event for cross-tab synchronization
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: AUTH_STORAGE_KEY,
          newValue: null,
          storageArea: localStorage,
        })
      );
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    const authData = authStorage.getAuthData();
    return authData !== null;
  },

  /**
   * Get current user's ID token
   */
  getIdToken: (): string | null => {
    const authData = authStorage.getAuthData();
    return authData?.idToken || null;
  },

  /**
   * Check if token needs refresh (within 10 minutes of expiry)
   */
  needsRefresh: (): boolean => {
    const authData = authStorage.getAuthData();
    if (!authData) return false;

    const refreshBuffer = 10 * 60 * 1000; // 10 minutes
    return Date.now() >= authData.expiresAt - refreshBuffer;
  },
};

/**
 * User profile storage
 */
export const userProfileStorage = {
  /**
   * Save user profile data
   */
  saveUserProfile: (profile: UserProfile): void => {
    try {
      const serialized = JSON.stringify(profile);
      storage.set(USER_PROFILE_STORAGE_KEY, serialized);
    } catch (error) {
      console.error("Failed to save user profile:", error);
    }
  },

  /**
   * Get user profile data
   */
  getUserProfile: (): UserProfile | null => {
    try {
      const stored = storage.get(USER_PROFILE_STORAGE_KEY);
      if (!stored) return null;

      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse stored user profile:", error);
      userProfileStorage.clearUserProfile();
      return null;
    }
  },

  /**
   * Clear user profile data
   */
  clearUserProfile: (): void => {
    storage.remove(USER_PROFILE_STORAGE_KEY);
  },

  /**
   * Update specific profile fields
   */
  updateUserProfile: (updates: Partial<UserProfile>): void => {
    const currentProfile = userProfileStorage.getUserProfile();
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      userProfileStorage.saveUserProfile(updatedProfile);
    }
  },
};

/**
 * Cross-tab synchronization
 */
export const authSyncUtils = {
  /**
   * Listen for auth changes across tabs
   */
  onAuthChange: (
    callback: (authData: AuthData | null) => void
  ): (() => void) => {
    if (typeof window === "undefined") return () => {};

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        try {
          const authData = event.newValue ? JSON.parse(event.newValue) : null;
          callback(authData);
        } catch (error) {
          console.error("Failed to parse auth data from storage event:", error);
          callback(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Return cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  },

  /**
   * Trigger auth sync across tabs
   */
  syncAuthState: (): void => {
    const authData = authStorage.getAuthData();
    if (authData) {
      authStorage.saveAuthData(authData); // This will trigger storage event
    }
  },
};

/**
 * Security utilities
 */
export const authSecurityUtils = {
  /**
   * Validate token format (basic check)
   */
  isValidTokenFormat: (token: string): boolean => {
    // Basic JWT format check (header.payload.signature)
    const parts = token.split(".");
    return parts.length === 3 && parts.every((part) => part.length > 0);
  },

  /**
   * Get token expiry time from JWT (without verification)
   */
  getTokenExpiry: (token: string): number | null => {
    try {
      if (!authSecurityUtils.isValidTokenFormat(token)) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
    } catch (error) {
      console.warn("Failed to parse token expiry:", error);
      return null;
    }
  },

  /**
   * Check if running in secure context
   */
  isSecureContext: (): boolean => {
    if (typeof window === "undefined") return true; // SSR
    return window.isSecureContext || window.location.protocol === "https:";
  },
};

/**
 * Migration utilities for existing Redux state
 */
export const migrationUtils = {
  /**
   * Migrate existing Redux auth state to new storage
   */
  migrateFromRedux: (reduxAuthState: { idToken: string | null }): void => {
    if (reduxAuthState.idToken && !authStorage.isAuthenticated()) {
      console.log("Migrating auth state from Redux to persistent storage");

      // Create auth data from Redux state
      // Note: We'll need to get fresh token data from Firebase
      // This is just a placeholder for the migration
      console.log("Redux migration would happen here");
    }
  },

  /**
   * Clear legacy storage keys
   */
  clearLegacyStorage: (): void => {
    // Clear any old storage keys that might exist
    const legacyKeys = ["auth_token", "user_data", "wisdm_token"];
    legacyKeys.forEach((key) => storage.remove(key));
  },
};
