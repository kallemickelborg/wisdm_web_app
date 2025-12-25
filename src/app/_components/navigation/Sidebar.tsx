// System Imports
import Image from "next/image";
import React, { useContext, useState } from "react";

// API/Database Imports
import { ThemeContext } from "@/app/_contexts/ThemeContext";
import { useUserProfile } from "@/app/_lib/hooks";
import { useAuth } from "@/app/_lib/hooks/useAuth";

// Component Imports
import AccountSettings from "@/app/_components/profile/AccountSettings";
import BaseToggle from "@/app/_components/toggles/BaseToggle";

// Stylesheet Imports
import styles from "@/app/_components/navigation/Sidebar.module.scss";

// Asset Imports
import arrowRightBrand from "@/assets/icons/arrow_right_brand.svg";
import closeIcon from "@/assets/icons/close.svg";
import wisdmLogoBrand from "@/assets/logos/wisdm_logo_brand.svg";
import wisdmLogoWhite from "@/assets/logos/wisdm_logo_white.svg";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const [isPushNotificationsOn, setIsPushNotificationsOn] = useState(false);

  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();

  const toggleAccountSettings = () => {
    setShowAccountSettings(!showAccountSettings);
  };

  const userSettingsData = {
    username: user?.username || "",
    email: user?.email || "",
    photo_url: user?.photo_url,
    name: user?.name || "",
    gender: user?.gender || "",
    locality: user?.locality || "",
    interests: user?.interests || [],
    traits: user?.traits || [],
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${isOpen ? styles.active : ""}`}
    >
      <header className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <Image
            src={theme === "light" ? wisdmLogoBrand : wisdmLogoWhite}
            alt="Wisdm Logo"
          />
          <h1>WISDM</h1>
        </div>
        <p className={styles.closeButton} onClick={onClose}>
          <Image src={closeIcon} alt="Close" />
        </p>
      </header>
      <h2>Account Settings</h2>
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarItem} onClick={toggleAccountSettings}>
          <p>Account Settings</p>
          <Image src={arrowRightBrand} alt="Arrow Right" />
        </div>
      </div>
      <h2>Notifications</h2>
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarItem}>
          <p>Email Notifications</p>
          <Image src={arrowRightBrand} alt="Arrow Right" />
        </div>
        <div className={styles.sidebarItem}>
          <p>Push Notifications</p>
          <BaseToggle
            isOn={isPushNotificationsOn}
            onToggle={() => setIsPushNotificationsOn(!isPushNotificationsOn)}
            ariaLabel="Toggle push notifications"
          />
        </div>
      </div>
      <h2>Display and Accessibility</h2>
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarItem}>
          <p>Themes</p>
          <Image src={arrowRightBrand} alt="Arrow Right" />
        </div>
        <div className={styles.sidebarItem}>
          <p>Languages</p>
          <Image src={arrowRightBrand} alt="Arrow Right" />
        </div>
        <div className={styles.sidebarItem}>
          <p>Dark/Light Mode</p>
          <BaseToggle
            isOn={theme === "light"}
            onToggle={toggleTheme}
            ariaLabel="Toggle dark/light mode"
          />
        </div>
      </div>
      <h2>Support and Feedback</h2>
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarItem}>
          <p>Help Center</p>
          <Image src={arrowRightBrand} alt="Arrow Right" />
        </div>
        <div className={styles.sidebarItem}>
          <p onClick={handleLogout}>Log Out</p>
          <Image src={arrowRightBrand} alt="Arrow Right" />
        </div>
      </div>
      <AccountSettings
        user={userSettingsData}
        onBack={toggleAccountSettings}
        isOpen={showAccountSettings}
      />
    </div>
  );
};

export default React.memo(Sidebar);
