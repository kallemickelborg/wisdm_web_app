/**
 * Hooks Barrel Export
 *
 * Central export point for all custom hooks.
 * Import hooks from this file for consistency and ease of use.
 *
 * @example
 * import { useUserProfile, useCommentThread, useTimelines } from '@/app/_lib/hooks';
 */

// User hooks
export {
  useUserProfile,
  useCreateUser,
  useUpdateUser,
  useUpdateUserInterests,
  useDeleteUser,
} from "./useUser";

// Comment hooks
export {
  useCommentThread,
  useTrendingComments,
  useRecentCommentsByUser,
  useCommentsByReference,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useVoteComment,
  useRemoveVote,
  useReportComment,
} from "./useComments";

// Timeline hooks
export {
  useTimelinesByCategory,
  useMultipleCategoryTimelines,
  useTimelineById,
  useTimelineDetails,
  useFeaturedTimelines,
  useTrendingTimelines,
  useCreateTimeline,
  useUpdateTimeline,
  useDeleteTimeline,
} from "./useTimelines";

// Category hooks
export {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategories";

// Trait hooks
export {
  useTraits,
  useTrait,
  useCreateTrait,
  useUpdateTrait,
  useDeleteTrait,
} from "./useTraits";

// Event hooks
export {
  useEvent,
  useEventsByParent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "./useEvents";

// Summary hooks
export {
  useSummary,
  useSummaryByParent,
  useCreateSummary,
  useUpdateSummary,
  useDeleteSummary,
} from "./useSummaries";

// Search hooks
export {
  useSearch,
  useSimpleSearch,
  useSearchTimelines,
  useSearchComments,
  useSearchUsers,
  useSearchSuggestions,
  useRecentSearches,
  useClearRecentSearches,
} from "./useSearch";

// Notification hooks
export {
  useNotifications,
  useUnreadNotificationCount,
  useNotificationSettings,
  useCreateNotification,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
  useUpdateNotificationSettings,
} from "./useNotifications";

// Auth hooks
export { useSignupForm } from "./useSignupForm";
