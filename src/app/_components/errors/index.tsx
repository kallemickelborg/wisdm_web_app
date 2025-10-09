/**
 * Error Components - Barrel Export
 *
 * BaseErrorDisplay is the primary error component with variant support:
 * - page: Full-page errors (404, 500, etc.)
 * - inline: Inline errors within content
 * - alert: Alert-style error banners
 * - field: Form field errors
 *
 * Error boundary components for React error handling
 * Specialized error components for specific use cases
 */

// Base Error Component
export { default as BaseErrorDisplay } from "./BaseErrorDisplay";
export type {
  BaseErrorDisplayProps,
  ErrorVariant,
  ErrorSeverity,
} from "./BaseErrorDisplay";

// Error Boundary Components
export {
  ErrorBoundary,
  WebSocketErrorBoundary,
  TimelineErrorBoundary,
  withErrorBoundary,
} from "./ErrorBoundary";

// Specialized Error Components (using BaseErrorDisplay)
export { default as NotFound } from "./NotFound";
export { default as ResourceError } from "./ResourceError";
export { default as OnboardingError } from "./OnboardingError";
export { default as OnboardingErrorSummary } from "./OnboardingErrorSummary";
