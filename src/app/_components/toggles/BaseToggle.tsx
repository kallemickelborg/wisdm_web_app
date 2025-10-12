// System Imports
import React from "react";

// Stylesheet Imports
import styles from "./BaseToggle.module.scss";

export interface BaseToggleProps {
  /** Whether the toggle is in the "on" state */
  isOn: boolean;
  /** Callback function when toggle is clicked */
  onToggle: () => void;
  /** Optional className for custom styling */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * BaseToggle - Generic toggle switch component
 *
 * A reusable toggle switch that can be used for any on/off state.
 *
 * @example
 * // Theme toggle
 * const { theme, toggleTheme } = useContext(ThemeContext);
 * <BaseToggle isOn={theme === "light"} onToggle={toggleTheme} ariaLabel="Toggle theme" />
 *
 * @example
 * // Generic toggle
 * const [isOn, setIsOn] = useState(false);
 * <BaseToggle isOn={isOn} onToggle={() => setIsOn(!isOn)} ariaLabel="Toggle notifications" />
 */
const BaseToggle: React.FC<BaseToggleProps> = ({
  isOn,
  onToggle,
  className,
  ariaLabel,
}) => {
  return (
    <label className={`${styles.toggleWrapper} ${className || ""}`}>
      <input
        type="checkbox"
        checked={isOn}
        onChange={onToggle}
        aria-label={ariaLabel}
      />
      <span className={`${styles.toggleSlider} ${isOn ? styles.on : ""}`}>
        <span className={styles.toggleCircle}></span>
      </span>
    </label>
  );
};

export default BaseToggle;

// Legacy export for backward compatibility (will be removed)
export { BaseToggle as ToggleSwitch };
