"use client";

// System Imports
import React, { ReactNode, useContext } from "react";

// Component Imports
import BaseToggle from "@/app/_components/toggles/BaseToggle";
import { SignupProvider } from "@/app/_contexts/SignupContext";
import { ThemeContext } from "@/app/_contexts/ThemeContext";

// Stylesheet Imports
import styles from "@/app/(pages)/auth/auth.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <SignupProvider>
      <div className={styles.authLayoutWrapper}>
        <div className={styles.authThemeToggle}>
          <BaseToggle
            isOn={theme === "light"}
            onToggle={toggleTheme}
            ariaLabel="Toggle dark/light mode"
          />
        </div>
        {children}
      </div>
    </SignupProvider>
  );
};

export default Layout;
