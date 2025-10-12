// Footer component types

export type FooterVariant = "dashboard" | "auth" | "none";

export type InfoTextType = "terms" | "custom";

export interface BaseFooterProps {
  /**
   * Footer variant
   * - dashboard: Shows NavigationBar for main app pages
   * - auth: Footer for auth/onboarding pages with optional button and info text
   * - none: No footer rendered
   */
  variant?: FooterVariant;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Custom children to render in footer
   */
  children?: React.ReactNode;

  /**
   * Info text type or custom text
   * - "terms": Shows Terms of Service and Privacy Policy text
   * - Custom string: Shows custom info text
   */
  info?: InfoTextType | string;

  /**
   * Button text (shows Next button wrapper when provided)
   */
  buttonText?: string;

  /**
   * Button click handler
   */
  onButtonClick?: () => void;

  /**
   * Button href (if using Link)
   */
  buttonHref?: string;

  /**
   * Button disabled state
   */
  buttonDisabled?: boolean;
}
