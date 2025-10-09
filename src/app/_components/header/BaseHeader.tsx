"use client";

// System Imports
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Component Imports
import SearchBar from "@/app/_components/navigation/SearchBar";
import InstructionOverlay from "@/app/_components/overlay/InstructionOverlay";
import ThemeToggle from "@/app/_components/buttons/ThemeToggle";
import { useSidebar } from "@/app/(pages)/(dashboard)/layout";

// Type Imports
import { BaseHeaderProps } from "./types";

// Stylesheet Imports
import styles from "./BaseHeader.module.scss";

// Asset Imports
import gearIcon from "@/assets/icons/gear.svg";
import questionIcon from "@/assets/icons/questionmark.svg";
import arrowLeftBrand from "@/assets/icons/arrow_left_brand.svg";
import wisdmLogoBrand from "@/assets/logos/wisdm_logo_brand.svg";

/**
 * BaseHeader Component
 *
 * A flexible, reusable header component that handles multiple variants:
 * - dashboard: Standard dashboard pages with optional icons and search
 * - timeline: Timeline pages with back button and theme toggle
 * - simple: Simple header with just title
 *
 * @example
 * // Dashboard header with modal and settings
 * <BaseHeader
 *   title="Explore"
 *   variant="dashboard"
 *   modal={modalConfig}
 *   search={{ show: true }}
 *   settings="gear"
 * />
 *
 * @example
 * // Timeline header with back button
 * <BaseHeader
 *   title="Timeline Title"
 *   variant="timeline"
 *   backButton={{ href: "/dashboard" }}
 * />
 *
 * @example
 * // Profile header with action button
 * <BaseHeader
 *   title="Profile"
 *   variant="dashboard"
 *   actionButton={{ label: "Edit", onClick: handleEdit }}
 * />
 */
const BaseHeader: React.FC<BaseHeaderProps> = ({
  title,
  subtitle,
  variant = "dashboard",
  modal,
  search,
  settings,
  actionButton,
  backButton,
  progressIndicator,
  logo,
  children,
  className = "",
}) => {
  const { openSidebar } = useSidebar();

  // Determine header classes based on variant
  const headerClasses = [
    styles.baseHeader,
    variant === "dashboard" && styles.variantDashboard,
    variant === "timeline" && styles.variantTimeline,
    variant === "simple" && styles.variantSimple,
    variant === "auth" && styles.variantAuth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Render timeline variant (with back button)
  if (variant === "timeline") {
    return (
      <>
        <header className={headerClasses}>
          <div className={styles.timelineHeader}>
            {backButton && (
              <Link
                href={backButton.href}
                className={styles.backButton}
                onClick={backButton.onClick}
              >
                <Image src={arrowLeftBrand} alt="Back" />
              </Link>
            )}
            <h1 className={styles.timelineTitle}>{title}</h1>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </>
    );
  }

  // Render auth variant (onboarding/authentication pages)
  if (variant === "auth") {
    return (
      <>
        <header className={headerClasses}>
          {backButton && (
            <Link
              href={backButton.href}
              className={styles.authBackButton}
              onClick={backButton.onClick}
            >
              <Image src={arrowLeftBrand} alt="Back" />
            </Link>
          )}
          {progressIndicator && (
            <div className={styles.progressIndicator}>
              {progressIndicator.icon && (
                <Image
                  src={progressIndicator.icon}
                  alt={`Progress ${progressIndicator.current} of ${
                    progressIndicator.total || 5
                  }`}
                  className={styles.progressIcon}
                />
              )}
            </div>
          )}
        </header>

        {/* Logo (if specified) */}
        {logo === "wisdm" && (
          <Image
            src={wisdmLogoBrand}
            alt="Wisdm Logo"
            className={styles.authLogo}
          />
        )}

        {/* Text block with title and subtitle */}
        {(title || subtitle) && (
          <div className={styles.authTextBlock}>
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}

        {children}
      </>
    );
  }

  // Render dashboard or simple variant
  return (
    <>
      <header className={headerClasses}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          {/* Action Icons Container */}
          {(modal || settings || actionButton) && (
            <div className={styles.iconContainer}>
              {/* Question/Help Icon */}
              {modal && (
                <div
                  className={styles.questionIcon}
                  onClick={modal.onToggle}
                  role="button"
                  aria-label="Help"
                >
                  <Image src={questionIcon} alt="Question" />
                </div>
              )}

              {/* Settings Icon */}
              {settings === "gear" && (
                <div
                  className={styles.settingsIcon}
                  onClick={openSidebar}
                  role="button"
                  aria-label="Settings"
                >
                  <Image src={gearIcon} alt="Settings" />
                </div>
              )}

              {/* Action Button (e.g., Edit button) */}
              {actionButton && (
                <button
                  className={`${styles.actionButton} ${
                    actionButton.className || ""
                  }`}
                  onClick={actionButton.onClick}
                >
                  {actionButton.label}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Instruction Overlay (Modal) */}
      {modal && (
        <InstructionOverlay
          isVisible={modal.isVisible}
          onClose={modal.onClose}
          triggerPosition={modal.triggerPosition}
        />
      )}

      {/* Search Bar */}
      {search?.show && (
        <SearchBar
          className={search.className}
          placeholder={search.placeholder}
        />
      )}

      {/* Custom Children */}
      {children}
    </>
  );
};

// Memoize the BaseHeader to prevent unnecessary re-renders
export default React.memo(BaseHeader);
