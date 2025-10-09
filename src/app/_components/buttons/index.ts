/**
 * Button Components - Barrel Export
 * 
 * Button components use BaseButton for consistency except:
 * - ThemeToggle: Context-aware theme switcher
 * - ToggleSwitch: Custom checkbox UI component
 * - OpenNestedThreadButton: Complex positioning with portals
 */

// Base Button System
export { default as BaseButton } from "./BaseButton";
export type { BaseButtonProps, ButtonVariant, ButtonSize } from "./BaseButton";

// Button Components (using BaseButton)
export { SubmitButton } from "./SubmitButton";
export { default as FederatedAuthButton } from "./FederatedAuthButton/FederatedAuthButton";

// Independent Button Components
export { default as ThemeToggle } from "./ThemeToggle";
export { default as ToggleSwitch } from "./ToggleSwitch";

