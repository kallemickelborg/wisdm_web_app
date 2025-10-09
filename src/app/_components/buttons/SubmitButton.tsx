"use client";

// System Imports
import React from "react";
import { useFormStatus } from "react-dom";
import BaseButton from "./BaseButton";

type SubmissionButtonProps = {
  text?: string;
  onClick?: () => any;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

/**
 * SubmitButton - Form submission button with pending state
 * Now uses BaseButton with loading state from useFormStatus
 */
export function SubmitButton({
  text = "Submit",
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = true,
}: SubmissionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <BaseButton
      variant={variant}
      onClick={onClick}
      type="submit"
      disabled={disabled}
      loading={pending}
      fullWidth={fullWidth}
    >
      {text}
    </BaseButton>
  );
}
