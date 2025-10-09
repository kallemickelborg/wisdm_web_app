"use client";

import React from "react";
import BaseErrorDisplay from "./BaseErrorDisplay";

interface ResourceErrorProps {
  message?: string;
  error?: Error | null;
  retry?: () => void;
}

/**
 * ResourceError - Resource loading error component
 * Now uses BaseErrorDisplay with 'page' variant
 */
const ResourceError: React.FC<ResourceErrorProps> = ({
  message = "Failed to load resource",
  error = null,
  retry,
}) => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <BaseErrorDisplay
      variant="page"
      severity="error"
      title="Something went wrong"
      message={message}
      errorDetails={error || undefined}
      primaryAction={
        retry
          ? {
              label: "Try Again",
              onClick: retry,
            }
          : undefined
      }
      secondaryAction={{
        label: "Go Back",
        onClick: handleGoBack,
      }}
      fullPage
    />
  );
};

export default ResourceError;
