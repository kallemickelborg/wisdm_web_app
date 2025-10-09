"use client";

// React
import { useState } from "react";

// Next
import { useRouter } from "next/navigation";

// System Imports
import Image from "next/image";
import Link from "next/link";

// Component Imports
import BaseHeader from "@/app/_components/header";
import BaseInput from "@/app/_components/inputs/BaseInput";
import BaseButton from "@/app/_components/buttons/BaseButton";

// Stylesheet Imports
import styles from "@/app/(pages)/login/auth.module.scss";

// Asset Imports
import progressCircle2 from "@/assets/icons/progress_circle_2.svg";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/redux_lib/hooks";
import { setSignupState, PersonalInfo } from "@/redux_lib/features/signupSlice";

// Firebase imports
import { onSignOut } from "@/app/_lib/firebase/auth/auth_sign_out";

// Name Moderation
import {
  basicNameModerationFilter,
  aiNameModerationRequest,
} from "@/app/_lib/helper/moderation/nameModeration";

import { SubmitButton } from "@/app/_components/buttons/SubmitButton";
import { headers } from "next/headers";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { useOnboardingLoadingState } from "@/hooks/useOnboardingLoadingState";
import { useOnboardingErrors } from "@/hooks/useOnboardingErrors";
import { validateRequired } from "@/app/_lib/validation/onboardingValidation";
import OnboardingError from "@/app/_components/errors/OnboardingError";
import OnboardingErrorSummary from "@/app/_components/errors/OnboardingErrorSummary";

interface ModerationResult {
  [key: string]: {
    isProblematic: boolean;
    problematicWords: [...any];
  };
}

const genderOptionsArray = ["Female", "Male", "Other", "Don't want to specify"];

const INIT_ERROR_STATE: PersonalInfo = {
  name: null,
  username: null,
  gender: null,
};

const PersonalInfoPage = () => {
  const signupState = useAppSelector((state) => state.signup);
  const personalInfoState = signupState.personalInfo;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useOnboardingLoadingState();
  const {
    fieldErrors,
    setFieldError,
    clearFieldErrors,
    formError,
    setFormError,
  } = useOnboardingErrors();

  const handleFieldUpdate = (formFieldName: string, newValue: string) => {
    dispatch(
      setSignupState({
        ...signupState,
        personalInfo: { ...personalInfoState, [formFieldName]: newValue },
      })
    );
  };

  const handleNameInputs = (formFieldName: string, newValue: string) => {
    const error = basicNameModerationFilter(newValue, formFieldName);
    if (error) {
      setFieldError(formFieldName, error);
    } else {
      setFieldError(formFieldName, null);
    }
    handleFieldUpdate(formFieldName, newValue);
  };

  const handleSelection = (formFieldName: string, newValue: string) => {
    if (newValue) {
      setFieldError(formFieldName, null);
    }
    handleFieldUpdate(formFieldName, newValue);
  };

  const handleSubmission = async () => {
    startLoading();
    clearFieldErrors();
    setFormError(null);

    const safetyTimeout = setTimeout(() => {
      stopLoading();
    }, 5000);

    let isValid = true;
    let errorFields: string[] = [];

    try {
      for (const field of ["name", "username", "gender"]) {
        const value = personalInfoState[field];
        const validation = validateRequired(
          value,
          field.charAt(0).toUpperCase() + field.slice(1)
        );

        if (!validation.isValid) {
          setFieldError(field, validation.errorMessage);
          errorFields.push(field);
          isValid = false;
        }
      }

      for (const field of ["name", "username"]) {
        const error = basicNameModerationFilter(
          personalInfoState[field] || "",
          field
        );
        if (error) {
          setFieldError(field, error);
          errorFields.push(field);
          isValid = false;
        }
      }

      if (isValid) {
        try {
          const getUsernameExistsEndpoint = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/get/username_exists?username=${personalInfoState.username}`;
          const usernameExists = await fetch(getUsernameExistsEndpoint);
          const result = await usernameExists.json();

          if (result.username_exists) {
            setFieldError(
              "username",
              "Sorry your desired username is already in use"
            );
            errorFields.push("username");
            isValid = false;
          }
        } catch (error) {
          console.error({
            error: "There was an error checking the username in the database",
            additionalDetails: error,
          });
        }
      }

      if (isValid) {
        const { name, username } = personalInfoState;

        try {
          const moderationResult: ModerationResult =
            await aiNameModerationRequest({ name, username });

          for (const [key, value] of Object.entries(moderationResult)) {
            if (value?.isProblematic) {
              setFieldError(
                key,
                `The following problematic words were detected in your ${key} entry: ${value.problematicWords}`
              );
              errorFields.push(key);
              isValid = false;
            }
          }
        } catch (error) {
          console.error({
            error: "Moderation request failed",
            additionalDetails: error,
          });
          isValid = false;
        }
      }

      if (!isValid) {
        setFormError(
          `Please fix the following errors: ${errorFields
            .map((f) => f.charAt(0).toUpperCase() + f.slice(1))
            .join(", ")}`
        );
      } else {
        await router.push("/login/signup/location");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      clearTimeout(safetyTimeout);
      stopLoading();
    }
  };

  const inputFieldArray = [
    {
      type: "text",
      placeholder: "John Doe",
      value: personalInfoState.name,
      name: "name",
      label: "Full Name",
    },
    {
      type: "text",
      placeholder: "teacher.s_pet123",
      value: personalInfoState.username,
      name: "username",
      label: "Choose a unique username",
    },
  ];

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <LoadingOverlay isVisible={isLoading} />
        <BaseHeader
          title="Tell us a little about yourself"
          variant="auth"
          backButton={{ href: "/login/signup", onClick: onSignOut }}
          progressIndicator={{
            current: 2,
            total: 5,
            icon: progressCircle2,
          }}
        />

        {inputFieldArray.map((item) => {
          const { name, type, placeholder, value, label } = item;
          return (
            <BaseInput
              key={name}
              label={label}
              name={name}
              type={type}
              placeholder={placeholder}
              value={value ?? ""}
              onChange={(e) => handleNameInputs(name, e.target.value)}
              variant="filled"
              fullWidth
            />
          );
        })}

        <p className={styles.infoText}>
          Want to go anonymous? You can change it in the settings.
        </p>

        <div className={styles.genderWrapper}>
          <label>What is your gender?</label>
          <div className={styles.genderButtons}>
            {genderOptionsArray.map((item) => {
              return (
                <BaseButton
                  key={item}
                  variant={
                    personalInfoState.gender === item ? "primary" : "secondary"
                  }
                  onClick={() => handleSelection("gender", item)}
                  className={styles.genderButton}
                >
                  {item}
                </BaseButton>
              );
            })}
          </div>
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

          <SubmitButton text="Next" onClick={handleSubmission} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
