import React from "react";
import LoadingOverlay from "../LoadingOverlay";
import styles from "@/app/_components/loading/LoadingComments/LoadingComments.module.scss";

interface LoadingCommentsProps {
  additionalText?: string;
}

/**
 * LoadingComments - Loading indicator for comments section
 * Now uses enhanced LoadingSpinner with text support
 */
const LoadingComments: React.FC<LoadingCommentsProps> = ({
  additionalText,
}) => {
  const loadingText = additionalText
    ? `Loading Comments...\n${additionalText}`
    : "Loading Comments...";

  return (
    <div className={styles.loadingContainer}>
      <LoadingOverlay size="medium" text={loadingText} />
    </div>
  );
};

export default LoadingComments;
