/**
 * Auth and Form Models
 * 
 * TypeScript types and interfaces for authentication and form state management.
 * Following Clean Code Architecture - all types stored in models/ directory.
 */

/**
 * Field-level error tracking
 * Maps field names to error messages
 */
export interface FieldErrors {
  [key: string]: string | null;
}

/**
 * Signup form state
 * Manages email/password signup form data and validation errors
 */
export interface SignupFormState {
  email: string;
  password: string;
  duplicatePassword: string;
  suggestedPassword: string;
  emailError: string;
  passwordError: string;
  duplicatePasswordError: string;
}

/**
 * Validation result
 * Standard return type for validation functions
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Form submission result
 * Standard return type for form submission handlers
 */
export interface FormSubmissionResult {
  success: boolean;
  error?: string;
}

