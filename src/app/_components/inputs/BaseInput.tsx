"use client";

import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
  forwardRef,
} from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./BaseInput.module.scss";

/**
 * Input variant types
 */
export type InputVariant = "default" | "filled" | "outlined";

/**
 * Input size options
 */
export type InputSize = "small" | "medium" | "large";

/**
 * Base input component props
 */
export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  // Variant and size
  variant?: InputVariant;
  size?: InputSize;

  // Label and helper text
  label?: string;
  helperText?: string;
  errorMessage?: string;

  // Icon support
  leftIcon?: string | StaticImageData | ReactNode;
  rightIcon?: string | StaticImageData | ReactNode;

  // States
  error?: boolean;
  success?: boolean;
  disabled?: boolean;

  // Textarea mode
  multiline?: boolean;
  rows?: number;

  // Styling
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  fullWidth?: boolean;

  // Additional content
  children?: ReactNode;
}

/**
 * BaseInput - Reusable input component with variant support
 *
 * Supports multiple input types through variant system:
 * - default: Standard input with minimal styling
 * - filled: Input with filled background
 * - outlined: Input with border outline
 *
 * Features:
 * - Label and helper text support
 * - Error and success states
 * - Icon support (left/right)
 * - Multiline (textarea) mode
 * - Full width option
 *
 * @example
 * <BaseInput
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={hasError}
 *   errorMessage="Invalid email"
 * />
 */
const BaseInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  BaseInputProps
>(
  (
    {
      variant = "default",
      size = "medium",
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      error = false,
      success = false,
      disabled = false,
      multiline = false,
      rows = 3,
      className = "",
      inputClassName = "",
      labelClassName = "",
      fullWidth = false,
      children,
      id,
      ...rest
    },
    ref
  ) => {
    // Generate ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Build class names
    const containerClasses = [
      styles.inputContainer,
      fullWidth ? styles.fullWidth : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputWrapperClasses = [
      styles.inputWrapper,
      styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
      error ? styles.error : "",
      success ? styles.success : "",
      disabled ? styles.disabled : "",
      leftIcon ? styles.hasLeftIcon : "",
      rightIcon ? styles.hasRightIcon : "",
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [styles.input, inputClassName]
      .filter(Boolean)
      .join(" ");

    const labelClasses = [styles.label, labelClassName]
      .filter(Boolean)
      .join(" ");

    // Render icon
    const renderIcon = (
      icon: string | StaticImageData | ReactNode,
      position: "left" | "right"
    ) => {
      if (!icon) return null;

      const iconClass =
        position === "left" ? styles.leftIcon : styles.rightIcon;

      // If icon is a React node, render it directly
      if (React.isValidElement(icon)) {
        return <span className={iconClass}>{icon}</span>;
      }

      // If icon is a string or StaticImageData, render as Image
      return (
        <span className={iconClass}>
          <Image
            src={icon as string | StaticImageData}
            alt=""
            width={size === "small" ? 16 : size === "large" ? 24 : 20}
            height={size === "small" ? 16 : size === "large" ? 24 : 20}
          />
        </span>
      );
    };

    // Render input or textarea
    const renderInput = () => {
      const commonProps = {
        id: inputId,
        className: inputClasses,
        disabled,
        ...rest,
      };

      if (multiline) {
        return (
          <textarea
            {...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        );
      }

      return (
        <input
          {...(commonProps as InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      );
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        <div className={inputWrapperClasses}>
          {leftIcon && renderIcon(leftIcon, "left")}
          {renderInput()}
          {rightIcon && renderIcon(rightIcon, "right")}
        </div>

        {error && errorMessage && (
          <p className={styles.errorText}>{errorMessage}</p>
        )}
        {!error && helperText && (
          <p className={styles.helperText}>{helperText}</p>
        )}
        {children}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";

export default BaseInput;
