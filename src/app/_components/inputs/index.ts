/**
 * Input Components - Barrel Export
 * 
 * BaseInput is the primary input component with variant support:
 * - default: Standard input with minimal styling
 * - filled: Input with filled background
 * - outlined: Input with border outline
 * 
 * Features:
 * - Label and helper text
 * - Error and success states
 * - Icon support (left/right)
 * - Multiline (textarea) mode
 * - Size variants (small, medium, large)
 * 
 * Legacy components:
 * - InputTemplate: Wrapper around BaseInput for backward compatibility
 */

// Base Input Component
export { default as BaseInput } from "./BaseInput";
export type { BaseInputProps, InputVariant, InputSize } from "./BaseInput";

// Legacy Input Components
export { default as InputTemplate } from "./InputTemplate/InputTemplate";

