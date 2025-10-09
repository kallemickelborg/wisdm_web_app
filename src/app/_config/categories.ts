/**
 * Category Configuration Management
 * 
 * Centralized configuration for timeline categories with environment-based settings
 */

export interface CategoryConfig {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface EnvironmentConfig {
  categories: CategoryConfig[];
  apiEndpoints: {
    base: string;
    timelines: string;
    categories: string;
    socket: string;
  };
  features: {
    enableWebSocket: boolean;
    enableRealTimeUpdates: boolean;
    enableCategoryFiltering: boolean;
  };
}

/**
 * Development Environment Configuration
 */
const developmentConfig: EnvironmentConfig = {
  categories: [
    {
      id: "c68e142e-2097-e9a5-c426-e005f21d64c9",
      title: "Domestic Politics",
      description: "Political events and discussions within the country",
      isActive: true
    },
    {
      id: "095e7a0f-8519-586c-b7a6-b0c298a280f4",
      title: "Entertainment",
      description: "Entertainment news, movies, music, and celebrity updates",
      isActive: true
    }
  ],
  apiEndpoints: {
    base: process.env.NEXT_PUBLIC_BASE_API_URL || "http://127.0.0.1:5000/api",
    timelines: "/timelines/get",
    categories: "/categories/get",
    socket: process.env.NEXT_PUBLIC_SOCKET_URL || "127.0.0.1:5000"
  },
  features: {
    enableWebSocket: true,
    enableRealTimeUpdates: true,
    enableCategoryFiltering: true
  }
};

/**
 * Production Environment Configuration
 */
const productionConfig: EnvironmentConfig = {
  categories: [
    {
      id: "c68e142e-2097-e9a5-c426-e005f21d64c9",
      title: "Domestic Politics",
      description: "Political events and discussions within the country",
      isActive: true
    },
    {
      id: "095e7a0f-8519-586c-b7a6-b0c298a280f4",
      title: "Entertainment",
      description: "Entertainment news, movies, music, and celebrity updates",
      isActive: true
    }
    // Add more categories for production as needed
  ],
  apiEndpoints: {
    base: process.env.NEXT_PUBLIC_BASE_API_URL || "",
    timelines: "/timelines/get",
    categories: "/categories/get",
    socket: process.env.NEXT_PUBLIC_SOCKET_URL || ""
  },
  features: {
    enableWebSocket: true,
    enableRealTimeUpdates: true,
    enableCategoryFiltering: true
  }
};

/**
 * Test Environment Configuration
 */
const testConfig: EnvironmentConfig = {
  categories: [
    {
      id: "test-category-1",
      title: "Test Category 1",
      description: "Test category for unit tests",
      isActive: true
    },
    {
      id: "test-category-2",
      title: "Test Category 2",
      description: "Another test category",
      isActive: false
    }
  ],
  apiEndpoints: {
    base: "http://localhost:3001/api",
    timelines: "/timelines/get",
    categories: "/categories/get",
    socket: "localhost:3001"
  },
  features: {
    enableWebSocket: false,
    enableRealTimeUpdates: false,
    enableCategoryFiltering: true
  }
};

/**
 * Get current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || "development";
  
  switch (environment.toLowerCase()) {
    case "production":
      return productionConfig;
    case "test":
    case "testing":
      return testConfig;
    case "development":
    case "dev":
    default:
      return developmentConfig;
  }
}

/**
 * Get active categories for current environment
 */
export function getActiveCategories(): CategoryConfig[] {
  const config = getEnvironmentConfig();
  return config.categories.filter(category => category.isActive !== false);
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryConfig | undefined {
  const config = getEnvironmentConfig();
  return config.categories.find(category => category.id === id);
}

/**
 * Get API endpoints for current environment
 */
export function getApiEndpoints() {
  const config = getEnvironmentConfig();
  return config.apiEndpoints;
}

/**
 * Get feature flags for current environment
 */
export function getFeatureFlags() {
  const config = getEnvironmentConfig();
  return config.features;
}

/**
 * Validate category ID format
 */
export function isValidCategoryId(id: string): boolean {
  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Get category validation errors
 */
export function validateCategory(category: Partial<CategoryConfig>): string[] {
  const errors: string[] = [];
  
  if (!category.id) {
    errors.push("Category ID is required");
  } else if (!isValidCategoryId(category.id)) {
    errors.push("Category ID must be a valid UUID");
  }
  
  if (!category.title || category.title.trim().length === 0) {
    errors.push("Category title is required");
  }
  
  return errors;
}

/**
 * Build API URL for timeline categories
 */
export function buildTimelineCategoryUrl(categoryId: string): string {
  const endpoints = getApiEndpoints();
  return `${endpoints.base}${endpoints.timelines}/timelines_by_category?category_id=${categoryId}`;
}

/**
 * Build API URL for individual timeline
 */
export function buildTimelineUrl(timelineId: string): string {
  const endpoints = getApiEndpoints();
  return `${endpoints.base}${endpoints.timelines}/timeline?id=${timelineId}`;
}

/**
 * Get WebSocket URL for current environment
 */
export function getWebSocketUrl(): string {
  const endpoints = getApiEndpoints();
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";
  const protocol = environment === "production" ? "wss" : "ws";
  return `${protocol}://${endpoints.socket}`;
}

// Export current environment config as default
export const config = getEnvironmentConfig();
