/**
 * Toggle Components
 * 
 * Base toggle switch component for on/off states.
 * 
 * Usage:
 * ```tsx
 * import BaseToggle from "@/app/_components/toggles";
 * 
 * // Theme toggle
 * const { theme, toggleTheme } = useContext(ThemeContext);
 * <BaseToggle 
 *   isOn={theme === "light"} 
 *   onToggle={toggleTheme} 
 *   ariaLabel="Toggle theme" 
 * />
 * 
 * // Generic toggle
 * const [isOn, setIsOn] = useState(false);
 * <BaseToggle 
 *   isOn={isOn} 
 *   onToggle={() => setIsOn(!isOn)} 
 *   ariaLabel="Toggle notifications" 
 * />
 * ```
 */

export { default } from "./BaseToggle";
export { default as BaseToggle } from "./BaseToggle";
export type { BaseToggleProps } from "./BaseToggle";

