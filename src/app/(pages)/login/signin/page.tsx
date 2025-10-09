"use client";

// System Imports
import { useState } from "react";
import Link from "next/link";

// API/Database Imports
import { logInWithEmailAndPassword } from "@/app/_lib/firebase/auth/auth_signin_password";
import { googleSignInSequence } from "@/app/_lib/firebase/auth/google/auth_google_signin_sequence";
import { facebookSignInSequence } from "@/app/_lib/firebase/auth/facebook/auth_facebook_signin_sequence";

// Component Imports
import BaseHeader from "@/app/_components/header";
import BaseInput from "@/app/_components/inputs/BaseInput";
import { SubmitButton } from "@/app/_components/buttons/SubmitButton";
import FederatedAuthButton from "@/app/_components/buttons/FederatedAuthButton/FederatedAuthButton";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import { useOnboardingLoadingState } from "@/hooks/useOnboardingLoadingState";

// Stylesheet Imports
import styles from "@/app/(pages)/login/auth.module.scss";

// Asset Imports
import googleIcon from "@/assets/icons/google.svg";
import facebookIcon from "@/assets/icons/facebook.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, startLoading, stopLoading } = useOnboardingLoadingState();

  const inputArray = [
    {
      label: "Username or Email",
      type: "text",
      name: "user",
      value: email,
      set: setEmail,
    },
    {
      label: "Password",
      type: "password",
      name: "password",
      value: password,
      set: setPassword,
    },
  ];
  const onClickFirebaseEmailPasswordLogin = async () => {
    if (email && password) {
      startLoading();
      try {
        await logInWithEmailAndPassword(email, password);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        stopLoading();
      }
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <LoadingOverlay isVisible={isLoading} />
        <BaseHeader
          title="Welcome Back"
          subtitle="Please enter your credentials to Log in"
          logo="wisdm"
          variant="auth"
          backButton={{ href: "/login" }}
        />

        <form onSubmit={(e) => e.preventDefault()}>
          {inputArray.map((item) => {
            const { label, type, name, value, set } = item;
            return (
              <BaseInput
                key={name}
                type={type}
                placeholder={label}
                name={name}
                required={true}
                value={value}
                onChange={(e) => set(e.target.value)}
                variant="filled"
                fullWidth
              />
            );
          })}
          <Link href="/login/forgotpassword" className={styles.forgotPassword}>
            Forgot Password?
          </Link>

          <div className={styles.orDivider}>
            <span>OR</span>
          </div>

          <div className={styles.authWrapper}>
            <FederatedAuthButton
              src={googleIcon}
              alt="Google Icon"
              text="Continue with Google"
              onClick={googleSignInSequence}
            />
            <FederatedAuthButton
              src={facebookIcon}
              alt="Facebook Icon"
              text="Continue with Facebook"
              onClick={facebookSignInSequence}
            />
          </div>
          <SubmitButton
            text="Log In"
            onClick={onClickFirebaseEmailPasswordLogin}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
