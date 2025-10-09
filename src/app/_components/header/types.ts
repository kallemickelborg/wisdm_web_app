import { ReactNode } from "react";

/**
 * Header variant types
 * - dashboard: Standard dashboard header with title and optional icons
 * - timeline: Timeline-specific header with back button
 * - simple: Simple header with just title
 * - auth: Authentication/onboarding header with back button and progress indicator
 */
export type HeaderVariant = "dashboard" | "timeline" | "simple" | "auth";

/**
 * Settings icon type
 * - gear: Settings/gear icon that opens sidebar
 * - profile: Profile/edit button
 */
export type SettingsType = "gear" | "profile";

/**
 * Modal configuration for help/question icon
 */
export interface ModalConfig {
  isVisible: boolean;
  onToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
  triggerPosition?: { x: number; y: number } | null;
  onClose: () => void;
}

/**
 * Search configuration
 */
export interface SearchConfig {
  show: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Base Header Props
 */
export interface BaseHeaderProps {
  /** Main title text */
  title: string;

  /** Optional subtitle text */
  subtitle?: string;

  /** Header variant type */
  variant?: HeaderVariant;

  /** Modal/overlay configuration (question mark icon) */
  modal?: ModalConfig;

  /** Search bar configuration */
  search?: SearchConfig;

  /** Settings icon type */
  settings?: SettingsType;

  /** Custom action button (for profile "Edit" button, etc.) */
  actionButton?: {
    label: string;
    onClick: () => void;
    className?: string;
  };

  /** Back button configuration (for timeline and auth variants) */
  backButton?: {
    href: string;
    onClick?: () => void;
  };

  /** Progress indicator (for auth variant) */
  progressIndicator?: {
    current: number; // Current step (1-5)
    total?: number; // Total steps (default: 5)
    icon?: any; // Optional custom progress icon
  };

  /** Logo configuration (for auth variant) */
  logo?: "wisdm" | "none"; // Show Wisdm logo or no logo

  /** Additional custom content to render in header */
  children?: ReactNode;

  /** Custom className for header container */
  className?: string;
}
