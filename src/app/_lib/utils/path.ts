/**
 * Path Utilities
 *
 * Client-side path manipulation utilities.
 *
 * Backend equivalent: WisdmNewsAPI/utils/standards/path.py
 * - standardize_path_anchor_ids() - Same as standardizePathAnchorIds()
 * - normalize_path() - Path normalization
 * - join_paths() - Join multiple path segments
 * - build_notification_path() - Build notification paths
 * - is_valid_path() - Path validation
 */

"use client";

/**
 * Get standardized path from current location
 * @returns Standardized path string
 *
 * Note: This is client-side only (uses window.location)
 */
export function standardizedPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

/**
 * Standardize path for anchor IDs
 * @param path - Path string to standardize
 * @returns Standardized path for use in anchor IDs
 *
 * Backend equivalent: standardize_path_anchor_ids() in WisdmNewsAPI/utils/standards/path.py
 */
export function standardizePathAnchorIds(path: string): string {
  return path.replace(/\//g, "-").replace(/^-/, "");
}
