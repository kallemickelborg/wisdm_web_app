"use client";

import React, { ReactNode } from "react";
import BaseButton from "../buttons/BaseButton";
import styles from "./BaseErrorDisplay.module.scss";

/**
 * Error display variant types
 */
export type ErrorVariant = "page" | "inline" | "alert" | "field";

/**
 * Error severity levels
 */
export type ErrorSeverity = "error" | "warning" | "info";

/**
 * Base error display component props
 */
export interface BaseErrorDisplayProps {
  // Variant and severity
  variant?: ErrorVariant;
  severity?: ErrorSeverity;

  // Content
  title?: string;
  message: string;
  errorDetails?: string | Error;

  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  // Styling
  className?: string;
  fullPage?: boolean;

  // Additional content
  children?: ReactNode;
}

/**
 * BaseErrorDisplay - Reusable error display component
 * 
 * Supports multiple error display types:
 * - page: Full-page error (404, 500, etc.)
 * - inline: Inline error within content
 * - alert: Alert-style error banner
 * - field: Form field error
 * 
 * @example
 * <BaseErrorDisplay
 *   variant="page"
 *   title="404 - Page Not Found"
 *   message="The page you're looking for doesn't exist."
 *   primaryAction={{ label: "Go Home", onClick: () => router.push('/') }}
 * />
 * 
 * @example
 * <BaseErrorDisplay
 *   variant="field"
 *   severity="error"
 *   message="Invalid email address"
 * />
 */
const BaseErrorDisplay: React.FC<BaseErrorDisplayProps> = ({
  variant = "inline",
  severity = "error",
  title,
  message,
  errorDetails,
  primaryAction,
  secondaryAction,
  className = "",
  fullPage = false,
  children,
}) => {
  // Build class names
  const containerClasses = [
    styles.errorContainer,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`severity${severity.charAt(0).toUpperCase() + severity.slice(1)}`],
    fullPage ? styles.fullPage : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Get error message from Error object if provided
  const getErrorMessage = () => {
    if (typeof errorDetails === "string") return errorDetails;
    if (errorDetails instanceof Error) return errorDetails.message;
    return null;
  };

  const detailsMessage = getErrorMessage();

  // Render icon based on severity
  const renderIcon = () => {
    switch (severity) {
      case "error":
        return <span className={styles.icon}>⚠️</span>;
      case "warning":
        return <span className={styles.icon}>⚠️</span>;
      case "info":
        return <span className={styles.icon}>ℹ️</span>;
      default:
        return null;
    }
  };

  // Render content based on variant
  const renderContent = () => {
    if (variant === "field") {
      return (
        <div className={styles.fieldError}>
          <p className={styles.message}>{message}</p>
        </div>
      );
    }

    return (
      <div className={styles.content}>
        {(variant === "page" || variant === "inline") && renderIcon()}
        
        {title && <h1 className={styles.title}>{title}</h1>}
        
        <p className={styles.message}>{message}</p>

        {detailsMessage && (
          <div className={styles.details}>
            <p>{detailsMessage}</p>
          </div>
        )}

        {children}

        {(primaryAction || secondaryAction) && (
          <div className={styles.actions}>
            {secondaryAction && (
              <BaseButton
                variant="secondary"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </BaseButton>
            )}
            {primaryAction && (
              <BaseButton
                variant="primary"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </BaseButton>
            )}
          </div>
        )}
      </div>
    );
  };

  return <div className={containerClasses}>{renderContent()}</div>;
};

export default BaseErrorDisplay;

