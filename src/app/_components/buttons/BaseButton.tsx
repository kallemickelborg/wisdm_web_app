"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./BaseButton.module.scss";

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'auth' | 'icon';

/**
 * Button size options
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Base button component props
 */
export interface BaseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  // Variant system
  variant?: ButtonVariant;
  
  // Size
  size?: ButtonSize;
  
  // Content
  children?: ReactNode;
  text?: string;
  
  // Icon support
  icon?: string | StaticImageData | ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  
  // States
  loading?: boolean;
  disabled?: boolean;
  
  // Styling
  className?: string;
  fullWidth?: boolean;
}

/**
 * BaseButton - Reusable button component with variant support
 * 
 * Supports multiple button types through variant system:
 * - primary: Main action button (brand color)
 * - secondary: Secondary action button
 * - tertiary: Minimal button
 * - auth: Authentication/federated auth button with icon
 * - icon: Icon-only button
 * 
 * @example
 * <BaseButton variant="primary" onClick={handleClick}>
 *   Click Me
 * </BaseButton>
 * 
 * @example
 * <BaseButton variant="auth" icon={googleIcon} text="Sign in with Google" />
 */
const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  text,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button',
  ...rest
}) => {
  // Build class names
  const buttonClasses = [
    styles.baseButton,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    iconOnly ? styles.iconOnly : '',
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ');

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a React node, render it directly
    if (React.isValidElement(icon)) {
      return <span className={styles.iconWrapper}>{icon}</span>;
    }

    // If icon is a string or StaticImageData, render as Image
    return (
      <span className={styles.iconWrapper}>
        <Image
          src={icon as string | StaticImageData}
          alt=""
          width={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          height={size === 'small' ? 16 : size === 'large' ? 24 : 20}
        />
      </span>
    );
  };

  // Render loading spinner
  const renderLoadingSpinner = () => {
    if (!loading) return null;
    
    return (
      <span className={styles.spinner}>
        <svg viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset="30"
          />
        </svg>
      </span>
    );
  };

  // Button content
  const buttonContent = text || children;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      type={type}
      {...rest}
    >
      {loading && renderLoadingSpinner()}
      {!loading && icon && iconPosition === 'left' && renderIcon()}
      {!iconOnly && buttonContent && (
        <span className={styles.buttonText}>{buttonContent}</span>
      )}
      {!loading && icon && iconPosition === 'right' && renderIcon()}
      {iconOnly && !loading && renderIcon()}
    </button>
  );
};

export default BaseButton;

