/**
 * Header Components
 * 
 * Consolidated header system for consistent page headers across the application.
 * 
 * Usage:
 * ```tsx
 * import BaseHeader from "@/app/_components/header";
 * 
 * // Dashboard header with modal and settings
 * <BaseHeader
 *   title="Explore"
 *   variant="dashboard"
 *   modal={modalConfig}
 *   search={{ show: true }}
 *   settings="gear"
 * />
 * 
 * // Timeline header
 * <BaseHeader
 *   title="Timeline Title"
 *   variant="timeline"
 *   backButton={{ href: "/dashboard" }}
 * />
 * 
 * // Profile header with action button
 * <BaseHeader
 *   title="Profile"
 *   variant="dashboard"
 *   actionButton={{ label: "Edit", onClick: handleEdit }}
 * />
 * ```
 */

export { default } from "./BaseHeader";
export * from "./types";

