import React from "react";
import BaseButton from "../BaseButton";

interface FederatedAuthButtonProps {
  src: string;
  alt: string;
  text: string;
  onClick: () => void;
}

/**
 * FederatedAuthButton - Authentication button with provider icon
 * Now uses BaseButton with 'auth' variant
 */
const FederatedAuthButton: React.FC<FederatedAuthButtonProps> = ({
  src,
  alt,
  text,
  onClick,
}) => {
  return (
    <BaseButton
      variant="auth"
      icon={src}
      text={text}
      onClick={onClick}
      fullWidth
    />
  );
};

export default FederatedAuthButton;
