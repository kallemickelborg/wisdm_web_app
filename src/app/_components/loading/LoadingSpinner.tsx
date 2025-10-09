import React from "react";
import { motion } from "motion/react";
import styles from "./LoadingSpinner.module.scss";

export type LoadingSpinnerSize = "small" | "medium" | "large" | number;
export type LoadingSpinnerVariant = "spinner" | "dots" | "pulse";

interface LoadingSpinnerProps {
  sideLength?: number | string;
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  color?: string;
  text?: string;
  className?: string;
}

/**
 * LoadingSpinner - Base loading indicator component
 *
 * Supports multiple variants:
 * - spinner: Rotating circle (default)
 * - dots: Three bouncing dots
 * - pulse: Pulsing circle
 *
 * @example
 * <LoadingSpinner size="medium" />
 * <LoadingSpinner variant="dots" text="Loading..." />
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  sideLength,
  size = "medium",
  variant = "spinner",
  color,
  text,
  className = "",
}) => {
  // Calculate size
  const getSize = (): number => {
    if (sideLength)
      return typeof sideLength === "number" ? sideLength : parseInt(sideLength);
    if (typeof size === "number") return size;

    const sizeMap = {
      small: 24,
      medium: 60,
      large: 100,
    };
    return sizeMap[size];
  };

  const spinnerSize = getSize();

  // Render spinner variant
  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className={styles.dotsContainer} style={{ height: spinnerSize }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={styles.dot}
                style={{
                  width: spinnerSize / 5,
                  height: spinnerSize / 5,
                  backgroundColor: color || "var(--color-brand)",
                }}
                animate={{ y: [0, -spinnerSize / 3, 0] }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <motion.div
            className={styles.pulseCircle}
            style={{
              width: spinnerSize,
              height: spinnerSize,
              backgroundColor: color || "var(--color-brand)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        );

      case "spinner":
      default:
        return (
          <motion.div
            className={styles.spinnerCircle}
            style={{
              width: spinnerSize,
              height: spinnerSize,
              borderColor: color ? `${color}33` : undefined,
              borderTopColor: color || undefined,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        );
    }
  };

  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      {renderSpinner()}
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
