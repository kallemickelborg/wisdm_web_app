/**
 * Loading Components - Barrel Export
 * 
 * LoadingSpinner is the base component with variant support:
 * - spinner: Rotating circle (default)
 * - dots: Three bouncing dots
 * - pulse: Pulsing circle
 * 
 * Specialized loading components:
 * - LoadingOverlay: Full-screen overlay with logo and timeout
 * - SplashScreen: Initial app splash screen
 * - LoadingComments: Comments-specific loading indicator
 */

// Base Loading Component
export { default as LoadingSpinner } from "./LoadingSpinner";
export type { LoadingSpinnerSize, LoadingSpinnerVariant } from "./LoadingSpinner";

// Specialized Loading Components
export { default as LoadingOverlay } from "./LoadingOverlay";
export { default as SplashScreen } from "./SplashScreen";
export { default as LoadingComments } from "./LoadingComments/LoadingComments";

