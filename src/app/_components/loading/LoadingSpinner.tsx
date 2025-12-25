import React from "react";
import styles from "./LoadingSpinner.module.scss";

export interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  isVisible?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = "currentColor",
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <svg
      className={styles.loadingSpinner}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles.loadingSpinnerCircle}
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default LoadingSpinner;
