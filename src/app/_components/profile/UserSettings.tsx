// System Imports
import React, { useState } from "react";
import Image from "next/image";

// Component Imports
import BaseCard from "@/app/_components/cards/BaseCard";
import { BaseButton } from "@/app/_components/buttons";
import CategorySelectionModal from "./CategorySelectionModal";

// Hooks
import { useCategories, useUpdateUserInterests } from "@/app/_lib/hooks";

// Models
import type { Category, Trait } from "@/models";

// Stylesheet Imports
import styles from "@/app/_components/profile/UserSettings.module.scss";

// Asset Imports
import placeholderAvatar from "@/assets/icons/user_avatar.svg";
import arrowLeftBrand from "@/assets/icons/arrow_left_brand.svg";

interface UserSettingsProps {
  user: {
    username?: string;
    email?: string;
    photo_url?: string | null;
    locality?: string;
    interests?: Category[];
    traits?: Trait[];
  };
  onBack: () => void;
  isOpen: boolean;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  user,
  onBack,
  isOpen,
}) => {
  const [isEditingInterests, setIsEditingInterests] = useState(false);

  // Fetch all categories for selection modal
  const { data: allCategories = [] } = useCategories();

  // Mutation hook for updating user interests
  const updateUserInterests = useUpdateUserInterests();

  const userInterests = user.interests || [];
  const userTraits = user.traits || [];

  // Handle saving selected categories
  const handleSaveInterests = (selectedCategoryIds: string[]) => {
    updateUserInterests.mutate(selectedCategoryIds, {
      onSuccess: () => {
        setIsEditingInterests(false);
      },
      onError: (error) => {
        console.error("Failed to update interests:", error);
        // TODO: Show error toast/notification to user
      },
    });
  };

  return (
    <div
      className={
        styles.userSettingsContainer + (isOpen ? " " + styles.active : "")
      }
    >
      <header className={styles.pageTitle}>
        <h1>User Settings</h1>
        <div className={styles.backButton} onClick={onBack}>
          <Image src={arrowLeftBrand} alt="Back" />
        </div>
      </header>

      {/* Categories/Interests Section */}
      <div className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Interests</h2>
          <BaseButton
            variant="primary"
            text="Edit"
            onClick={() => setIsEditingInterests(true)}
            size="small"
          />
        </div>

        {/* Masonry Grid of User's Current Interests */}
        <div className={styles.categoriesGrid}>
          {userInterests.length > 0 ? (
            userInterests.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryContainer}>
                  {category.image_url && (
                    <img
                      className={styles.categoryImage}
                      src={category.image_url}
                      alt={category.name}
                    />
                  )}
                  <div className={styles.categoryOverlay}>
                    <p>{category.name}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>
              No interests selected. Click "Edit" to add some!
            </p>
          )}
        </div>
      </div>

      {/* Traits Section */}
      <div className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h2>Your Traits</h2>
        </div>
        <div className={styles.traitsList}>
          {userTraits.length > 0 ? (
            userTraits.map((trait) => (
              <div key={trait.id} className={styles.traitChip}>
                <span>{trait.label}</span>
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>No traits selected</p>
          )}
        </div>
      </div>

      {/* Category Selection Modal */}
      <CategorySelectionModal
        isOpen={isEditingInterests}
        onClose={() => setIsEditingInterests(false)}
        allCategories={allCategories}
        selectedCategoryIds={userInterests.map((cat) => cat.id)}
        onSave={handleSaveInterests}
        isLoading={updateUserInterests.isPending}
      />
    </div>
  );
};

export default UserSettings;
