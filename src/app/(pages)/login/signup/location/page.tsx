"use client";

import { useState } from "react";

import { useAppDispatch } from "@/redux_lib/hooks";
import { useAppSelector } from "@/redux_lib/hooks";
import { setSignupState } from "@/redux_lib/features/signupSlice";

import { SubmitButton } from "@/app/_components/buttons/SubmitButton";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { useOnboardingLoadingState } from "@/hooks/useOnboardingLoadingState";
import { useOnboardingErrors } from "@/hooks/useOnboardingErrors";
import { validateRequired } from "@/app/_lib/validation/onboardingValidation";
import OnboardingErrorSummary from "@/app/_components/errors/OnboardingErrorSummary";

import { useRouter } from "next/navigation";

// System Imports
import Image from "next/image";
import Link from "next/link";

// Component Imports
import BaseHeader from "@/app/_components/header";

// Stylesheet Imports
import styles from "@/app/(pages)/login/auth.module.scss";

// Asset Imports
import progressCircle3 from "@/assets/icons/progress_circle_3.svg";
import countries from "@/assets/countries.json";

interface Country {
  name: string;
  code: string;
}

const countryMap: Country[] = countries;

const LocationInfoPage = () => {
  const dispatch = useAppDispatch();
  const signup = useAppSelector((state) => state.signup);
  const location = signup.locality;
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useOnboardingLoadingState();
  const { formError, setFormError, fieldErrors } = useOnboardingErrors();

  const handleUpdate = (value: string) => {
    dispatch(setSignupState({ ...signup, locality: value }));
    if (value) {
      setFormError(null);
    }
  };

  const handleSubmission = async () => {
    const validation = validateRequired(location, "Location");

    if (validation.isValid) {
      setFormError(null);
      startLoading();
      await router.push("/login/signup/tags");
    } else {
      setFormError("Please select your country");
      stopLoading();
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <LoadingOverlay isVisible={isLoading} />
        <BaseHeader
          title="Where do you live?"
          subtitle="This helps us personalize your feed with more relevant content."
          variant="auth"
          backButton={{ href: "/login/signup/personal" }}
          progressIndicator={{
            current: 3,
            total: 5,
            icon: progressCircle3,
          }}
        />

        <div className={styles.selectWrapper}>
          <label>Country</label>
          <select
            className={styles.selectField}
            onChange={(e) => handleUpdate(e.target.value)}
            value={location || ""}
          >
            <option value="" disabled>
              Select your country
            </option>
            {countryMap.map((item) => {
              return (
                <option key={item.code} value={item.name}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <OnboardingErrorSummary
          formError={formError}
          fieldErrors={fieldErrors}
          className="errorSummaryContainer"
        />

        <div className={styles.nextWrapper}>
          <p className={styles.infoText}>
            You can customize the visibility of your information in the settings
          </p>

          <SubmitButton
            onClick={handleSubmission}
            text="Next"
            disabled={!location}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInfoPage;
