// System Imports

// Component Imports
import { BaseFooter } from "@/app/_components/footer";
import BaseHeader from "@/app/_components/header";
import BaseInput from "@/app/_components/inputs/BaseInput";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

const ForgotPasswordView = () => (
  <div className={styles.loginWrapper}>
    <div className={styles.loginContainer}>
      <BaseHeader
        title="Forgot Password?"
        subtitle="A verification code will be sent to your email"
        variant="auth"
        backButton={{ href: "/auth/login" }}
      />
      <BaseInput type="email" placeholder="Email" variant="filled" fullWidth />

      <BaseFooter
        variant="auth"
        info="terms"
        buttonText="Send Code"
        buttonHref="/auth/login/resetpassword"
      />
    </div>
  </div>
);

export default ForgotPasswordView;
