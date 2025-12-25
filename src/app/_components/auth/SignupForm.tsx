"use client";

import styles from "@/app/(pages)/auth/auth.module.scss";
import BaseButton from "@/app/_components/buttons/BaseButton";
import OnboardingErrorSummary from "@/app/_components/errors/OnboardingErrorSummary";
import { BaseFooter } from "@/app/_components/footer";
import BaseHeader from "@/app/_components/header";
import BaseInput from "@/app/_components/inputs/BaseInput";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { facebookSignInSequence } from "@/app/_lib/firebase/auth/facebook/auth_facebook_signin_sequence";
import { googleSignInSequence } from "@/app/_lib/firebase/auth/google/auth_google_signin_sequence";
import { copyToClipboard } from "@/app/_lib/helper/clipboard/clipboard";
import { useSignupForm } from "@/app/_lib/hooks";
import facebookIcon from "@/assets/icons/facebook.svg";
import googleIcon from "@/assets/icons/google.svg";
import { useCallback, useEffect, useState } from "react";

const SignupForm = () => {
  const {
    formState,
    setEmail,
    setPassword,
    setDuplicatePassword,
    handleSubmit,
    isLoading,
    formError,
  } = useSignupForm();

  const [federatedAuthLoading, setFederatedAuthLoading] = useState(false);
  const [clipboardCopied, setClipboardCopied] = useState(false);

  const {
    email,
    password,
    duplicatePassword,
    emailError,
    passwordError,
    duplicatePasswordError,
  } = formState;

  // Handle clipboard copy feedback
  useEffect(() => {
    if (clipboardCopied) {
      const timer = setTimeout(() => setClipboardCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [clipboardCopied]);

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setFederatedAuthLoading(true);
    try {
      await googleSignInSequence();
    } catch (error) {
      console.error("Google signup failed:", error);
    } finally {
      setFederatedAuthLoading(false);
    }
  };

  // Handle Facebook signup
  const handleFacebookSignup = async () => {
    setFederatedAuthLoading(true);
    try {
      await facebookSignInSequence();
    } catch (error) {
      console.error("Facebook signup failed:", error);
    } finally {
      setFederatedAuthLoading(false);
    }
  };

  // Prepare field errors for error summary
  const getFieldErrors = () => {
    const errors: { [key: string]: string | null } = {};
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (duplicatePasswordError)
      errors.duplicatePassword = duplicatePasswordError;
    return errors;
  };

  const isAnyLoading = isLoading || federatedAuthLoading;

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        {/*         <LoadingOverlay isVisible={isAnyLoading} />
         */}
        <BaseHeader
          title="Let's Get Started"
          variant="auth"
          backButton={{ href: "/auth" }}
        />

        {/* Email Input */}
        <BaseInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          errorMessage={emailError}
          variant="filled"
          fullWidth
        />

        {/* Password Input */}
        <BaseInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          errorMessage={passwordError}
          variant="filled"
          fullWidth
        />

        {/* Verify Password Input - Only show if password is entered */}
        {password && (
          <BaseInput
            id="duplicatePassword"
            name="duplicatePassword"
            type="password"
            label="Verify Password"
            placeholder="Re-enter Password"
            value={duplicatePassword}
            onChange={(e) => setDuplicatePassword(e.target.value)}
            error={!!duplicatePasswordError}
            errorMessage={duplicatePasswordError}
            variant="filled"
            fullWidth
          />
        )}

        {/* OR Divider */}
        <div className={styles.orDivider}>
          <span>OR</span>
        </div>

        {/* Federated Auth Buttons */}
        <div className={styles.authWrapper}>
          <BaseButton
            variant="auth"
            icon={googleIcon}
            text="Continue with Google"
            onClick={handleGoogleSignup}
            disabled={isAnyLoading}
            fullWidth
          />
          <BaseButton
            variant="auth"
            icon={facebookIcon}
            text="Continue with Facebook"
            onClick={handleFacebookSignup}
            disabled={isAnyLoading}
            fullWidth
          />
        </div>

        {/* Error Summary */}
        <OnboardingErrorSummary
          formError={formError}
          fieldErrors={getFieldErrors()}
          className="errorSummaryContainer"
        />

        {/* Footer with Next Button */}
        <BaseFooter
          variant="auth"
          info="terms"
          buttonText="Next"
          onButtonClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SignupForm;
