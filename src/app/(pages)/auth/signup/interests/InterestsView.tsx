"use client";

// System Imports
import { useState } from "react";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

// Component Imports
import { BaseFooter } from "@/app/_components/footer";
import BaseHeader from "@/app/_components/header";

// Asset Imports
import progressCircle5 from "@/assets/icons/progress_circle_5.svg";
import tech from "@/assets/images/tech.png";

import { useSignup } from "@/app/_contexts/SignupContext";

import { useRouter } from "next/navigation";

import OnboardingErrorSummary from "@/app/_components/errors/OnboardingErrorSummary";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import type { FieldErrors } from "@/models";

// Services
import { apiClient } from "@/services/api/apiClient";

// Hooks
import { useCategories } from "@/app/_lib/hooks";

const InterestsView = () => {
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { signupState, setSignupState } = useSignup();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors] = useState<FieldErrors>({});

  const handleInterestClick = (categoryId: string) => {
    setSelectedInterestIds((prev) => {
      const newInterests = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      // Clear error if at least 5 interests are selected
      if (newInterests.length >= 5) {
        setFormError(null);
      }

      return newInterests;
    });
  };

  const handleSubmission = async () => {
    if (selectedInterestIds.length < 5) {
      setFormError(
        `Please select at least 5 interests (${selectedInterestIds.length}/5 selected)`
      );
      return;
    }

    setIsLoading(true);
    // Send category IDs instead of labels
    const updatedSignupState = {
      ...signupState,
      interests: selectedInterestIds,
    };
    setSignupState(updatedSignupState);

    try {
      // Use apiClient instead of apiHTTPWrapper
      const response = await apiClient.post(
        "/users/post/create_user",
        updatedSignupState
      );

      if (response && typeof response === "object" && "error" in response) {
        throw new Error(response.error as string);
      }

      router.push("/home");
    } catch (error) {
      console.error("Submission failed:", error);
      setFormError("Failed to create your account. Please try again.");
      setIsLoading(false);
    }
  };

  // Show loading state while fetching categories
  if (categoriesLoading) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <LoadingOverlay isVisible={true} />
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  // Show error state if categories failed to load
  if (categoriesError || !categories) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContainer}>
          <BaseHeader
            title="What are you interested in?"
            subtitle="Pick 5 to customize your news feed"
            variant="auth"
            backButton={{ href: "/auth/signup/tags" }}
            progressIndicator={{
              current: 5,
              total: 5,
              icon: progressCircle5,
            }}
          />
          <OnboardingErrorSummary
            formError="Failed to load categories. Please try again."
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
          title="What are you interested in?"
          subtitle="Pick 5 to customize your news feed"
          variant="auth"
          backButton={{ href: "/auth/signup/tags" }}
          progressIndicator={{
            current: 5,
            total: 5,
            icon: progressCircle5,
          }}
        />

        <p className={styles.interestCounter}>
          Selected: {selectedInterestIds.length}/5 (minimum)
        </p>

        <div className={styles.interestsGrid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${styles.interestItem} ${
                selectedInterestIds.includes(category.id) ? styles.selected : ""
              }`}
              onClick={() => handleInterestClick(category.id)}
            >
              <img src={tech.src} alt={category.name} />
              <p>{category.name}</p>
            </div>
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
          buttonDisabled={selectedInterestIds.length < 5}
          buttonText={
            selectedInterestIds.length < 5
              ? `Select ${5 - selectedInterestIds.length} more`
              : "Finish"
          }
        />
      </div>
    </div>
  );
};

export default InterestsView;
