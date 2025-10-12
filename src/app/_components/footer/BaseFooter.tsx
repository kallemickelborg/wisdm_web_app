"use client";

// System Imports
import React from "react";
import Link from "next/link";

// Component Imports
import NavigationBar from "@/app/_components/navigation/NavigationBar";
import BaseButton from "@/app/_components/buttons/BaseButton";

// Type Imports
import { BaseFooterProps } from "./types";

// Stylesheet Imports
import styles from "./BaseFooter.module.scss";
import authStyles from "@/app/(pages)/auth/auth.module.scss";

/**
 * BaseFooter Component
 *
 * A flexible, reusable footer component that handles multiple variants:
 * - dashboard: Shows NavigationBar for main app pages (home, explore, profile, vote, notifications)
 * - auth: Footer for auth/onboarding pages with optional button and info text
 * - none: No footer rendered
 *
 * @example
 * // Dashboard footer with NavigationBar
 * <BaseFooter variant="dashboard" />
 *
 * @example
 * // Auth footer with custom content
 * <BaseFooter variant="auth">
 *   <p>© 2024 Wisdm. All rights reserved.</p>
 * </BaseFooter>
 *
 * @example
 * // Auth footer with Next button and terms
 * <BaseFooter
 *   variant="auth"
 *   info="terms"
 *   buttonText="Next"
 *   buttonHref="/auth/signup/location"
 * />
 *
 * @example
 * // Auth footer with custom info text
 * <BaseFooter
 *   variant="auth"
 *   info="You can customize the visibility of your information in the settings"
 *   buttonText="Continue"
 *   onButtonClick={handleSubmit}
 * />
 *
 * @example
 * // No footer
 * <BaseFooter variant="none" />
 */
const BaseFooter: React.FC<BaseFooterProps> = ({
  variant = "dashboard",
  className = "",
  children,
  info,
  buttonText,
  onButtonClick,
  buttonHref,
}) => {
  // Don't render anything for "none" variant
  if (variant === "none") {
    return null;
  }

  // Determine if we should show the nextWrapper (button + info)
  const showNextWrapper = variant === "auth" && (buttonText || info);

  // Determine footer classes based on variant
  const footerClasses = [
    styles.baseFooter,
    variant === "dashboard" && styles.variantDashboard,
    variant === "auth" && styles.variantAuth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Render dashboard variant (with NavigationBar)
  if (variant === "dashboard") {
    return (
      <footer className={footerClasses}>
        <NavigationBar />
        {children}
      </footer>
    );
  }

  // Render auth variant (with optional Next button wrapper and info text)
  if (variant === "auth") {
    return (
      <footer className={footerClasses}>
        {showNextWrapper && (
          <div className={authStyles.nextWrapper}>
            {/* Show terms text if info="terms" */}
            {info === "terms" && (
              <p className={authStyles.infoText}>
                By continuing you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
              </p>
            )}
            {/* Show custom info text if provided and not "terms" */}
            {info && info !== "terms" && (
              <p className={authStyles.infoText}>{info}</p>
            )}
            {/* Show button if buttonText is provided */}
            {buttonText && (
              <BaseButton variant="primary" onClick={onButtonClick}>
                {buttonHref ? (
                  <Link href={buttonHref}>{buttonText}</Link>
                ) : (
                  buttonText
                )}
              </BaseButton>
            )}
          </div>
        )}
        {children}
      </footer>
    );
  }

  return null;
};

// Memoize the BaseFooter to prevent unnecessary re-renders
export default React.memo(BaseFooter);
