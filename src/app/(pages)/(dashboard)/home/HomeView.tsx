"use client";

// System Imports
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

// API/Database Imports
import { getActiveCategories } from "@/app/_config/categories";

// TanStack Query Hooks
import { useMultipleCategoryTimelines } from "@/app/_lib/hooks/useTimelines";

// Component Imports
import BaseCard from "@/app/_components/cards/BaseCard";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";
import BaseHeader from "@/app/_components/header";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/home/Home.module.scss";

const HomeView = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayTriggerPosition, setOverlayTriggerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const toggleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOverlayVisible) {
      setOverlayTriggerPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
    setIsOverlayVisible(!isOverlayVisible);
  };

  // --- CATEGORY CONFIGURATION ---
  // ✅ Using centralized configuration management
  const categories = getActiveCategories();
  const categoryIds = categories.map((cat) => cat.id);

  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const selectedCategory = categories[selectedCategoryIdx];

  // Use TanStack Query for timeline data
  const {
    data: categoryData,
    isLoading: allLoading,
    error: categoryQueryError,
  } = useMultipleCategoryTimelines(categoryIds);

  // Extract timelines and errors from query result
  const allCategoryTimelines = categoryData?.timelinesMap || {};
  const allCategoryErrors = categoryData?.errorsMap || {};

  // Get timelines and error for selected category
  const categoryTimelines = allCategoryTimelines[selectedCategory.id] || [];
  const categoryError =
    allCategoryErrors[selectedCategory.id] ||
    categoryQueryError?.message ||
    null;
  const categoryLoading = allLoading;

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
        <h2>{selectedCategory.title}</h2>
      </div>

      <div className={styles.feedWrapper}>
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
            onDragEnd={(event, info) => {
              setTimeout(() => {
                isDragging.current = false;
              }, 0);
              if (
                info.offset.x < -100 &&
                selectedCategoryIdx < categories.length - 1
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
                <LoadingSpinner />
              ) : categoryError ? (
                <div>{categoryError}</div>
              ) : categoryTimelines.length > 0 ? (
                categoryTimelines.map((timeline) => {
                  const imageMap: { [key: string]: any } = {
                    "timeline_1.png": require("@/assets/images/timeline_1.png"),
                  };
                  const imageSource =
                    imageMap[timeline.image] ||
                    require("@/assets/images/timeline_1.png");

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
      </div>
    </div>
  );
};

export default HomeView;
