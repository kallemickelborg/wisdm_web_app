"use client";

import { useState } from "react";

import { useSignup } from "@/app/_contexts/SignupContext";

import OnboardingErrorSummary from "@/app/_components/errors/OnboardingErrorSummary";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { validateRequired } from "@/app/_lib/validation/onboardingValidation";
import type { FieldErrors } from "@/models";

import { useRouter } from "next/navigation";

// Component Imports
import BaseHeader from "@/app/_components/header";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

// Asset Imports
import { BaseFooter } from "@/app/_components/footer";
import countries from "@/assets/countries.json";
import progressCircle3 from "@/assets/icons/progress_circle_3.svg";

interface Country {
  name: string;
  code: string;
}

const countryMap: Country[] = countries;

const LocationView = () => {
  const { signupState, setSignupState } = useSignup();
  const location = signupState.locality;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors] = useState<FieldErrors>({});

  const handleUpdate = (value: string) => {
    setSignupState({ ...signupState, locality: value });
    if (value) {
      setFormError(null);
    }
  };

  const handleSubmission = () => {
    const validation = validateRequired(location, "Location");

    if (validation.isValid) {
      setFormError(null);
      setIsLoading(true);
      router.push("/auth/signup/tags");
    } else {
      setFormError("Please select your country");
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
          backButton={{ href: "/auth/signup/personal" }}
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

        <BaseFooter
          variant="auth"
          info="You can customize the visibility of your information in the settings"
          buttonText="Next"
          onButtonClick={handleSubmission}
        />

        {/* Other Components */}
        <OnboardingErrorSummary
          formError={formError}
          fieldErrors={fieldErrors}
          className="errorSummaryContainer"
        />
      </div>
    </div>
  );
};

export default LocationView;
