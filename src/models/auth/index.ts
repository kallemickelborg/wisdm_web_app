export interface FieldErrors {
  [key: string]: string | null;
}

export interface SignupFormState {
  email: string;
  password: string;
  duplicatePassword: string;
  emailError: string;
  passwordError: string;
  duplicatePasswordError: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export interface FormSubmissionResult {
  success: boolean;
  error?: string;
}
