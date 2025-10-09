import React, { ReactNode } from "react";
import BaseInput from "../BaseInput";

interface InputProps {
  id: string;
  type: string;
  value: string;
  text: string;
  name: string;
  placeholder?: string;
  errorMessage?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

/**
 * InputTemplate - Form input wrapper component
 * Now uses BaseInput for consistent styling and behavior
 *
 * @deprecated Consider using BaseInput directly for new implementations
 */
const InputTemplate: React.FC<InputProps> = ({
  id,
  type,
  value,
  text,
  name,
  placeholder = "",
  errorMessage = "",
  labelClass = "",
  inputClass = "",
  errorClass = "",
  onClick,
  onChange,
  onBlur,
  children,
}) => {
  return (
    <BaseInput
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onClick={onClick}
      onChange={onChange}
      onBlur={onBlur}
      label={text}
      errorMessage={errorMessage}
      error={!!errorMessage}
      inputClassName={inputClass}
      labelClassName={labelClass}
      variant="filled"
      fullWidth
    >
      {children}
    </BaseInput>
  );
};

export default InputTemplate;
