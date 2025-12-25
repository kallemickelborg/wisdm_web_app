// System Imports
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Component Imports
import { BaseButton } from "@/app/_components/buttons";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";

// Models
import type { Category } from "@/models";

// Stylesheet Imports
import styles from "./CategorySelectionModal.module.scss";

// Asset Imports
import closeIcon from "@/assets/icons/close.svg";

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCategories: Category[];
  selectedCategoryIds: string[];
  onSave: (selectedIds: string[]) => void;
  isLoading?: boolean;
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  allCategories,
  selectedCategoryIds,
  onSave,
  isLoading = false,
}) => {
  // Local state for selected categories (allows cancel without saving)
  const [localSelectedIds, setLocalSelectedIds] =
    useState<string[]>(selectedCategoryIds);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSelectedIds(selectedCategoryIds);
  }, [selectedCategoryIds]);

  const toggleCategory = (categoryId: string) => {
    setLocalSelectedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    onSave(localSelectedIds);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedCategoryIds); // Reset to original
    onClose();
  };

  if (!isOpen) return null;

  return isLoading ? (
    <LoadingOverlay />
  ) : (
    <div className={styles.modalOverlay} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Select Your Interests</h2>
          <button className={styles.closeButton} onClick={handleCancel}>
            <Image src={closeIcon} alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Subtitle */}
        <p className={styles.modalSubtitle}>
          Choose the topics you're interested in. You can select as many as you
          like.
        </p>

        {/* Selected Count */}
        <div className={styles.selectedCount}>
          <span>
            {localSelectedIds.length} categor
            {localSelectedIds.length === 1 ? "y" : "ies"} selected
          </span>
        </div>

        {/* Categories Grid */}
        <div className={styles.categoriesGrid}>
          {allCategories.map((category) => {
            const isSelected = localSelectedIds.includes(category.id);

            return (
              <div
                key={category.id}
                className={styles.categoryCard}
                onClick={() => toggleCategory(category.id)}
              >
                <div className={styles.categoryContainer}>
                  {category.image_url && (
                    <img
                      className={
                        styles.categoryImage +
                        (isSelected ? " " + styles.selected : "")
                      }
                      src={category.image_url}
                      alt={category.name}
                    />
                  )}
                  <div className={styles.categoryOverlay}>
                    <p>{category.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <BaseButton
            variant="secondary"
            text="Cancel"
            onClick={handleCancel}
            fullWidth
          />
          <BaseButton
            variant="primary"
            text={isLoading ? "Saving..." : "Save Changes"}
            onClick={handleSave}
            disabled={isLoading}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionModal;
