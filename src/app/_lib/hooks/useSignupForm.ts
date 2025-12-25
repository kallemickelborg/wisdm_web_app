import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmailAndPassword } from "@/app/_lib/firebase/auth/auth_signup_password";
import {
  validateEmail,
  validatePasswordStrength,
  validatePasswordsMatch,
} from "@/app/_lib/validation/onboardingValidation";
import type { SignupFormState, FormSubmissionResult } from "@/models";

interface UseSignupFormReturn {
  // Form state
  formState: SignupFormState;

  // Form actions
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setDuplicatePassword: (value: string) => void;

  // Validation
  validateForm: () => boolean;
  isFormValid: boolean;

  // Submission
  handleSubmit: () => Promise<FormSubmissionResult>;

  // Loading state
  isLoading: boolean;

  // Error state
  formError: string | null;
  clearFormError: () => void;
}

export const useSignupForm = (): UseSignupFormReturn => {
  const router = useRouter();

  // Form state
  const [formState, setFormState] = useState<SignupFormState>({
    email: "",
    password: "",
    duplicatePassword: "",
    emailError: "",
    passwordError: "",
    duplicatePasswordError: "",
  });

  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Update individual fields
  const setEmail = useCallback((value: string) => {
    setFormState((prev) => ({
      ...prev,
      email: value,
      emailError: "",
    }));
    setFormError(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setFormState((prev) => {
      // Check if passwords match when password changes
      const duplicatePasswordError =
        prev.duplicatePassword && value !== prev.duplicatePassword
          ? "Passwords do not match"
          : "";

      return {
        ...prev,
        password: value,
        passwordError: "",
        duplicatePasswordError,
      };
    });
    setFormError(null);
  }, []);

  const setDuplicatePassword = useCallback((value: string) => {
    setFormState((prev) => {
      // Check if passwords match
      const duplicatePasswordError =
        value && value !== prev.password ? "Passwords do not match" : "";

      return {
        ...prev,
        duplicatePassword: value,
        duplicatePasswordError,
      };
    });
    setFormError(null);
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newState = { ...formState };

    // Validate email
    const emailValidation = validateEmail(formState.email);
    if (!emailValidation.isValid) {
      newState.emailError = emailValidation.errorMessage || "";
      isValid = false;
    } else {
      newState.emailError = "";
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(formState.password);
    if (!passwordValidation.isValid) {
      newState.passwordError = passwordValidation.errorMessage || "";
      isValid = false;
    } else {
      newState.passwordError = "";
    }

    // Validate passwords match
    const passwordMatchValidation = validatePasswordsMatch(
      formState.password,
      formState.duplicatePassword
    );
    if (!passwordMatchValidation.isValid) {
      newState.duplicatePasswordError =
        passwordMatchValidation.errorMessage || "";
      isValid = false;
    } else {
      newState.duplicatePasswordError = "";
    }

    setFormState(newState);
    return isValid;
  }, [formState]);

  // Check if form is valid (all fields filled, no errors)
  const isFormValid = useMemo(() => {
    const {
      email,
      password,
      duplicatePassword,
      emailError,
      passwordError,
      duplicatePasswordError,
    } = formState;

    return (
      email.length > 0 &&
      password.length > 0 &&
      duplicatePassword.length > 0 &&
      !emailError &&
      !passwordError &&
      !duplicatePasswordError
    );
  }, [formState]);

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    // Clear previous errors
    setFormError(null);

    // Validate form
    if (!validateForm()) {
      const error = "Please fix the form errors and try again";
      setFormError(error);
      return { success: false, error };
    }

    // Start loading
    setIsLoading(true);

    try {
      const result: any = await signUpWithEmailAndPassword(
        formState.email,
        formState.password
      );

      if (result?.user) {
        // Success - navigate to next step
        router.push("/auth/signup/personal");
        return { success: true };
      } else if (result?.errorCode) {
        // Firebase error
        const { errorMessage, errorCode } = result;

        // Set appropriate field error
        if (errorCode === "auth/weak-password") {
          setFormState((prev) => ({
            ...prev,
            passwordError: errorMessage,
          }));
        } else if (errorCode === "auth/email-already-in-use") {
          setFormState((prev) => ({
            ...prev,
            emailError: "This email is already registered",
          }));
        } else {
          setFormState((prev) => ({
            ...prev,
            emailError: errorMessage,
          }));
        }

        const error =
          "There was an error creating your account. Please try again.";
        setFormError(error);
        return { success: false, error };
      }

      const error = "An unexpected error occurred. Please try again.";
      setFormError(error);
      return { success: false, error };
    } catch (error: any) {
      console.error("Signup failed:", error);
      const errorMessage =
        "Signup failed. Please check your connection and try again.";
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [formState, validateForm, router]);

  const clearFormError = useCallback(() => {
    setFormError(null);
  }, []);

  return {
    formState,
    setEmail,
    setPassword,
    setDuplicatePassword,
    validateForm,
    isFormValid,
    handleSubmit,
    isLoading,
    formError,
    clearFormError,
  };
};
