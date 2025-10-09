// System Imports
import Link from "next/link";

// Component Imports
import BaseHeader from "@/app/_components/header";
import BaseInput from "@/app/_components/inputs/BaseInput";
import BaseButton from "@/app/_components/buttons/BaseButton";

// Stylesheet Imports
import styles from "@/app/(pages)/login/auth.module.scss";

interface NavigationActions {
  [key: string]: () => void;
}

const ForgotPasswordPage = ({ login }: NavigationActions) => (
  <div className={styles.loginWrapper}>
    <div className={styles.loginContainer}>
      <BaseHeader
        title="Forgot Password?"
        subtitle="A verification code will be sent to your email"
        variant="auth"
        backButton={{ href: "/login/signin" }}
      />
      <BaseInput type="email" placeholder="Email" variant="filled" fullWidth />

      <div className={styles.nextWrapper}>
        <p className={styles.infoText}>
          By continuing you agree to our <a href="/terms">Terms of Service</a>{" "}
          and <a href="/privacy">Privacy Policy</a>.
        </p>
        <BaseButton variant="primary">
          <Link href="">Next</Link>
        </BaseButton>
      </div>
    </div>
  </div>
);

export default ForgotPasswordPage;
