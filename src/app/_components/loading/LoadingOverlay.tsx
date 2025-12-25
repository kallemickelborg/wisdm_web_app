import wisdmLogo from "@/assets/logos/wisdm_logo_brand.svg";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import styles from "./LoadingOverlay.module.scss";
export type LoadingOverlayVariant = "logo" | "dots";

interface LoadingOverlayProps {
  variant?: LoadingOverlayVariant;
  text?: string;
  className?: string;
  isVisible?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  text,
  variant = "logo",
  className = "",
}) => {
  // Loader variant
  const renderOverlay = () => {
    switch (variant) {
      case "dots":
        return (
          <div className={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={styles.dot}
                animate={{ y: [0, -30 / 3, 0] }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );

      case "logo":
      default:
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <Image src={wisdmLogo} alt="Wisdm Logo" priority />
          </motion.div>
        );
    }
  };

  return (
    <div className={`${styles.loadingOverlayContainer} ${className}`}>
      {renderOverlay()}
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default LoadingOverlay;
