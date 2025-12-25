"use client";

// System Imports
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

// TanStack Query Hooks
import { useMultipleCategoryTimelines } from "@/app/_lib/hooks/useTimelines";
import { useUserProfile } from "@/app/_lib/hooks";
import { useAuth } from "@/app/_lib/hooks/useAuth";

// Component Imports
import BaseCard from "@/app/_components/cards/BaseCard";
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import BaseHeader from "@/app/_components/header";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/home/Home.module.scss";

// Next.js
import { useRouter } from "next/navigation";

const HomeView = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayTriggerPosition, setOverlayTriggerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOverlayVisible) {
      setOverlayTriggerPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
    setIsOverlayVisible(!isOverlayVisible);
  };

  // Fetch user profile to get their selected interests (categories)
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUserProfile();

  // Extract user's interests (categories)
  const userCategories = user?.interests || [];
  const categoryIds = userCategories.map((cat) => cat.id);

  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const selectedCategory = userCategories[selectedCategoryIdx];

  // Use TanStack Query for timeline data (only if user has categories)
  const shouldFetchTimelines = categoryIds.length > 0;
  const {
    data: categoryData,
    isLoading: allLoading,
    error: categoryQueryError,
  } = useMultipleCategoryTimelines(shouldFetchTimelines ? categoryIds : []);

  // Extract timelines and errors from query result
  const allCategoryTimelines = categoryData?.timelinesMap || {};
  const allCategoryErrors = categoryData?.errorsMap || {};

  // Get timelines and error for selected category
  const categoryTimelines = selectedCategory
    ? allCategoryTimelines[selectedCategory.id] || []
    : [];
  const categoryError = selectedCategory
    ? allCategoryErrors[selectedCategory.id] ||
      categoryQueryError?.message ||
      null
    : null;
  const categoryLoading = userLoading || allLoading;

  // Show error if user has no interests selected
  if (userError) {
    return (
      <div className={styles.pageContainer}>
        <BaseHeader title="For You" variant="dashboard" settings="gear" />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Error loading user profile. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Show loading state while user data is being fetched
  if (userLoading || !isMounted) {
    return (
      <div className={styles.pageContainer}>
        <BaseHeader title="For You" variant="dashboard" settings="gear" />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          {isMounted && <LoadingOverlay />}
        </div>
      </div>
    );
  }

  // Show message if user has no interests
  if (userCategories.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <BaseHeader title="For You" variant="dashboard" settings="gear" />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>No Interests Selected</h2>
          <p>
            Please select your interests in your profile settings to see
            personalized timelines.
          </p>
          {user?.partial_data && (
            <div style={{ marginTop: "2rem" }}>
              <p style={{ color: "#ff6b6b", marginBottom: "1rem" }}>
                It looks like you didn't complete the onboarding process.
              </p>
              <button
                onClick={() => router.push("/auth/signup/personal")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
              >
                Complete Onboarding
              </button>
              <button
                onClick={logout}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SWIPE DIRECTION STATE ---
  const [direction, setDirection] = useState(0);

  // Track if a drag occurred to prevent click navigation
  const isDragging = useRef(false);

  // Card swipe variants (no opacity, just x)
  const swipeVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? window.innerWidth : -window.innerWidth,
    }),
    center: { x: 0 },
    exit: (direction: number) => ({
      x: direction < 0 ? window.innerWidth : -window.innerWidth,
    }),
  };

  return (
    <div className={styles.pageContainer}>
      <BaseHeader
        title="For You"
        variant="dashboard"
        modal={{
          isVisible: isOverlayVisible,
          onToggle: toggleOverlay,
          triggerPosition: overlayTriggerPosition,
          onClose: () => setIsOverlayVisible(false),
        }}
        settings="gear"
      />
      <div className={styles.sectionTitle}>
        <h2>{selectedCategory?.name || "Loading..."}</h2>
      </div>

      <div className={styles.feedWrapper}>
        {selectedCategory && (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={selectedCategory.id}
              custom={direction}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={styles.feedContainer}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => {
                isDragging.current = true;
              }}
              onDragEnd={(_event, info) => {
                setTimeout(() => {
                  isDragging.current = false;
                }, 0);
                if (
                  info.offset.x < -100 &&
                  selectedCategoryIdx < userCategories.length - 1
                ) {
                  setDirection(1);
                  setSelectedCategoryIdx(selectedCategoryIdx + 1);
                } else if (info.offset.x > 100 && selectedCategoryIdx > 0) {
                  setDirection(-1);
                  setSelectedCategoryIdx(selectedCategoryIdx - 1);
                }
              }}
              style={{ touchAction: "pan-y" }}
            >
              <section className={styles.feedSection}>
                {categoryLoading ? (
                  isMounted && <LoadingOverlay />
                ) : categoryError ? (
                  <div>{categoryError}</div>
                ) : categoryTimelines.length > 0 ? (
                  categoryTimelines.map((timeline) => {
                    // Use timeline image_url if available, otherwise use default
                    const defaultImage = require("@/assets/images/timeline_1.png");
                    const imageSource = timeline.image_url || defaultImage;

                    return (
                      <Link
                        href={`/timeline?id=${timeline.id}`}
                        key={timeline.id}
                        onPointerDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          if (isDragging.current) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        <BaseCard
                          variant="timeline"
                          image={imageSource}
                          imagePosition="top"
                          showOverlay={true}
                          title={timeline.title}
                        />
                      </Link>
                    );
                  })
                ) : (
                  <div>No timelines found for this category.</div>
                )}
              </section>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HomeView;
