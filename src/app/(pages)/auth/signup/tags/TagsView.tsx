"use client";

// System Imports
import { useState } from "react";

import { useSignup } from "@/app/_contexts/SignupContext";
import { useRouter } from "next/navigation";

import OnboardingErrorSummary from "@/app/_components/errors/OnboardingErrorSummary";
import { BaseFooter } from "@/app/_components/footer";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { validateMinArrayLength } from "@/app/_lib/validation/onboardingValidation";
import type { FieldErrors } from "@/models";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

// Component Imports
import BaseHeader from "@/app/_components/header";

// Asset Imports
import progressCircle4 from "@/assets/icons/progress_circle_4.svg";

// Hooks
import { useTraits } from "@/app/_lib/hooks";

const TagsView = () => {
  const { signupState, setSignupState } = useSignup();
  const router = useRouter();
  const {
    data: traits,
    isLoading: traitsLoading,
    error: traitsError,
  } = useTraits();
  const [activeTraitIds, setActiveTraitIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors] = useState<FieldErrors>({});

  const handleTagClick = (traitId: string) => {
    setActiveTraitIds((prevIds) => {
      const newIds = prevIds.includes(traitId)
        ? prevIds.filter((id) => id !== traitId)
        : [...prevIds, traitId];

      // Clear error message if user has selected 5 or more tags
      if (newIds.length >= 5) {
        setFormError(null);
      }

      return newIds;
    });
  };

  const handleSubmission = () => {
    const validation = validateMinArrayLength(activeTraitIds, 5);

    if (validation.isValid) {
      setFormError(null);
      setIsLoading(true);
      // Send trait IDs instead of class names
      setSignupState({ ...signupState, traits: activeTraitIds });
      router.push("/auth/signup/interests");
    } else {
      setFormError(validation.errorMessage);
    }
  };

  // Show loading state while fetching traits
  if (traitsLoading) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <LoadingOverlay isVisible={true} />
          <p>Loading traits...</p>
        </div>
      </div>
    );
  }

  // Show error state if traits failed to load
  if (traitsError || !traits) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <BaseHeader
            title="Where do you stand?"
            subtitle="Choose the tags below that you think best describes yourself"
            variant="auth"
            backButton={{ href: "/auth/signup/location" }}
            progressIndicator={{
              current: 4,
              total: 5,
              icon: progressCircle4,
            }}
          />
          <OnboardingErrorSummary
            formError="Failed to load traits. Please try again."
            fieldErrors={{}}
            className="errorSummaryContainer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <LoadingOverlay isVisible={isLoading} />
        <BaseHeader
          title="Where do you stand?"
          subtitle="Choose the tags below that you think best describes yourself"
          variant="auth"
          backButton={{ href: "/auth/signup/location" }}
          progressIndicator={{
            current: 4,
            total: 5,
            icon: progressCircle4,
          }}
        />

        <p className={styles.tagCounter}>
          Selected: {activeTraitIds.length}/5 (minimum)
        </p>

        <div className={styles.tagContainer}>
          {traits.map((trait) => (
            <button
              key={trait.id}
              className={`${styles.tagButton} ${
                activeTraitIds.includes(trait.id)
                  ? styles[
                      `active${trait.class_name
                        .charAt(0)
                        .toUpperCase()}${trait.class_name.slice(1)}`
                    ]
                  : ""
              }`}
              onClick={() => handleTagClick(trait.id)}
            >
              {trait.label}
            </button>
          ))}
        </div>

        <OnboardingErrorSummary
          formError={formError}
          fieldErrors={fieldErrors}
          className="errorSummaryContainer"
        />

        <BaseFooter
          variant="auth"
          info="You can customize the visibility of your information in the settings"
          onButtonClick={handleSubmission}
          buttonDisabled={activeTraitIds.length < 5}
          buttonText={
            activeTraitIds.length < 5
              ? `Select ${5 - activeTraitIds.length} more`
              : "Next"
          }
        />
      </div>
    </div>
  );
};

export default TagsView;
