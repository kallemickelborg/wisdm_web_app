"use client";

// System Imports
import Link from "next/link";
import { useState } from "react";

// API/Database Imports
import { logInWithEmailAndPassword } from "@/app/_lib/firebase/auth/auth_signin_password";
import { facebookSignInSequence } from "@/app/_lib/firebase/auth/facebook/auth_facebook_signin_sequence";
import { googleSignInSequence } from "@/app/_lib/firebase/auth/google/auth_google_signin_sequence";

// Component Imports
import BaseButton from "@/app/_components/buttons/BaseButton";
import BaseHeader from "@/app/_components/header";
import BaseInput from "@/app/_components/inputs/BaseInput";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

// Asset Imports
import { BaseFooter } from "@/app/_components/footer";
import facebookIcon from "@/assets/icons/facebook.svg";
import googleIcon from "@/assets/icons/google.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      try {
        await logInWithEmailAndPassword(email, password);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
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
          backButton={{ href: "/auth" }}
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
          <Link
            href="/auth/login/forgotpassword"
            className={styles.forgotPassword}
          >
            Forgot Password?
          </Link>

          <div className={styles.orDivider}>
            <span>OR</span>
          </div>

          <div className={styles.authWrapper}>
            <BaseButton
              variant="auth"
              icon={googleIcon}
              text="Continue with Google"
              onClick={googleSignInSequence}
              fullWidth
            />
            <BaseButton
              variant="auth"
              icon={facebookIcon}
              text="Continue with Facebook"
              onClick={facebookSignInSequence}
              fullWidth
            />
          </div>
        </form>
        <BaseFooter
          variant="auth"
          info="terms"
          buttonText="Log In"
          onButtonClick={onClickFirebaseEmailPasswordLogin}
        />
      </div>
    </div>
  );
};

export default LoginPage;
