"use client";

import React from "react";
import BaseErrorDisplay from "./BaseErrorDisplay";

export type ErrorType = "field" | "alert" | "standard";

interface OnboardingErrorProps {
  message: string | null;
  type?: ErrorType;
  className?: string;
}

/**
 * OnboardingError - Onboarding form error component
 * Now uses BaseErrorDisplay with appropriate variant
 */
const OnboardingError: React.FC<OnboardingErrorProps> = ({
  message,
  type = "standard",
  className,
}) => {
  if (!message) return null;

  // Map old type to new variant
  const variantMap: Record<ErrorType, "field" | "alert" | "inline"> = {
    field: "field",
    alert: "alert",
    standard: "inline",
  };

  return (
    <BaseErrorDisplay
      variant={variantMap[type]}
      severity="error"
      message={message}
      className={className}
    />
  );
};

export default OnboardingError;
