import { ReactNode } from "react";
import { StaticImageData } from "next/image";

/**
 * Card variant types
 */
export type CardVariant =
  | "activity"
  | "notification"
  | "topic"
  | "timeline"
  | "source"
  | "explore"
  | "vote"
  | "comment";

/**
 * Card layout options
 */
export type CardLayout = "default" | "compact" | "horizontal";

/**
 * Image position within card
 */
export type ImagePosition = "top" | "background";

/**
 * Card metadata for displaying counts, author info, etc.
 */
export interface CardMetadata {
  upvotes?: number;
  comments?: number;
  author?: string;
  date?: string;
  publication?: string;
  username?: string;
  time?: string;
}

/**
 * Card action configuration
 */
export interface CardAction {
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
}

/**
 * Base card component props
 */
export interface BaseCardProps {
  // Variant system
  variant?: CardVariant;

  // Layout
  layout?: CardLayout;

  // Image support
  image?: string | StaticImageData;
  imagePosition?: ImagePosition;
  showOverlay?: boolean;

  // Content
  title?: string;
  subtitle?: string;
  content?: string | ReactNode;

  // Metadata/Footer
  metadata?: CardMetadata;
  footer?: ReactNode;

  // Actions
  onClick?: () => void;
  actionIcon?: ReactNode;

  // Styling
  className?: string;
  animate?: boolean;

  // Children for custom content
  children?: ReactNode;
}
