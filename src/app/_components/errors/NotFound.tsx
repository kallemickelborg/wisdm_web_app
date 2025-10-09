"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BaseErrorDisplay from "./BaseErrorDisplay";

interface NotFoundProps {
  message?: string;
  backPath?: string;
}

/**
 * NotFound - 404 error page component
 * Now uses BaseErrorDisplay with 'page' variant
 */
const NotFound: React.FC<NotFoundProps> = ({
  message = "The page you're looking for doesn't exist or has been moved.",
  backPath = "/",
}) => {
  const router = useRouter();

  return (
    <BaseErrorDisplay
      variant="page"
      severity="error"
      title="404 - Page Not Found"
      message={message}
      primaryAction={{
        label: "Return to Home",
        onClick: () => router.push(backPath),
      }}
      fullPage
    />
  );
};

export default NotFound;
