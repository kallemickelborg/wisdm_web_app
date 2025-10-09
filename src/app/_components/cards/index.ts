/**
 * Card Components - Barrel Export
 *
 * BaseCard is the single reusable card component that handles all variants through props.
 *
 * Supported variants:
 * - 'activity': Content card with voting and comments
 * - 'notification': Alert-style card with action icon
 * - 'topic': Image card with overlay and metadata
 * - 'timeline': Image card with title overlay
 * - 'source': Background image card with metadata
 * - 'explore': Image wrapper card for carousel/grid display
 * - 'vote': Interactive voting card with state machine
 * - 'comment': Comment card with user avatar and voting
 *
 * Usage:
 * ```tsx
 * import { BaseCard } from '@/app/_components/cards';
 *
 * <BaseCard variant="timeline" image={img} title="Title" />
 * <BaseCard variant="activity" content="Content" metadata={{ upvotes: 5 }} />
 * ```
 */

// Base Card System - Single source of truth for all card components
export { default as BaseCard } from "./BaseCard";
export * from "./types";
