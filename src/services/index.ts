// API Client
export { apiClient, ApiError, getErrorMessage } from "./api/apiClient";
export type { RequestOptions } from "./api/apiClient";

// CRUD Operations
export { CrudOperations, createCrudService } from "./api/CrudOperations";
export type {
  CrudConfig,
  PaginationParams,
  QueryParams,
} from "./api/CrudOperations";

// User Service
export { userService } from "./userService";

// Comment Service
export { commentService } from "./commentService";

// Timeline Service
export { timelineService } from "./timelineService";

// Category Service
export { categoryService } from "./categoryService";

// Trait Service
export { traitService } from "./traitService";

// Event Service
export { eventService } from "./eventService";

// Summary Service
export { summaryService } from "./summaryService";

// Search Service
export { searchService } from "./searchService";

// Notification Service
export { notificationService } from "./notificationService";

// Utility Service
export { utilityService } from "./utilityService";
