// System Imports
import React, { useState } from "react";
import Image from "next/image";

// Component Imports
import BaseToggle from "@/app/_components/toggles/BaseToggle";
import BaseInput from "@/app/_components/inputs/BaseInput";

// Stylesheet Imports
import styles from "@/app/_components/profile/UserSettings.module.scss";

// Asset Imports
import placeholderAvatar from "@/assets/icons/user_avatar.svg";
import arrowLeftBrand from "@/assets/icons/arrow_left_brand.svg";
import editIcon from "@/assets/icons/edit.svg";

interface AccountSettingsProps {
  user: {
    username: string;
    email: string;
    photo_url?: string | null;
  };
  onBack: () => void;
  isOpen: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  user,
  onBack,
  isOpen,
}) => {
  const [displayUsername, setDisplayUsername] = useState(false);
  const [displayLabels, setDisplayLabels] = useState(false);

  return (
    <div
      className={
        styles.userSettingsContainer + (isOpen ? " " + styles.active : "")
      }
    >
      <header className={styles.pageTitle}>
        <h1>Account Settings</h1>
        <Image
          src={user.photo_url || placeholderAvatar}
          alt={`${user.username}'s avatar`}
          width={160}
          height={160}
        />
        <div className={styles.backButton} onClick={onBack}>
          <Image src={arrowLeftBrand} alt="Back" />
        </div>
      </header>

      <div className={styles.labelWrapper}>
        <label>Username</label>
        <div className={styles.labelContainer}>
          <BaseInput
            type="text"
            variant="filled"
            value={user.username}
            readOnly
          />
          <span className={styles.editIcon}>
            <Image src={editIcon} alt="edit icon" width={24} height={24} />
          </span>
        </div>
      </div>
      <div className={styles.labelWrapper}>
        <label>Email</label>
        <div className={styles.labelContainer}>
          <BaseInput
            type="email"
            variant="filled"
            value={user.email}
            readOnly
          />
          <span className={styles.editIcon}>
            <Image src={editIcon} alt="edit icon" width={24} height={24} />
          </span>
        </div>
      </div>

      <div className={styles.settingsContainer}>
        <div className={styles.settingsBody}>
          <label>Display Username</label>
          <p>
            Publicly displays your username when you comment, like, or interact
            with posts.
          </p>
        </div>
        <div className={styles.toggleContainer}>
          <BaseToggle
            isOn={displayUsername}
            onToggle={() => setDisplayUsername(!displayUsername)}
            ariaLabel="Toggle display username"
          />
        </div>
      </div>
      <div className={styles.settingsContainer}>
        <div className={styles.settingsBody}>
          <label>Display Labels</label>
          <p>
            Publicly displays your sentiment labels when you comment, like, or
            interact with posts.
          </p>
        </div>
        <div className={styles.toggleContainer}>
          <BaseToggle
            isOn={displayLabels}
            onToggle={() => setDisplayLabels(!displayLabels)}
            ariaLabel="Toggle display labels"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
