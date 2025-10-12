"use client";

// System Imports
import React, { useState } from "react";
import Image from "next/image";

// Component Imports
import BaseHeader from "@/app/_components/header";
import ProfileTabs from "@/app/_components/profile/ProfileTabs";
import UserSettings from "@/app/_components/profile/UserSettings";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/profile/Profile.module.scss";

// Asset Imports
import placeholderAvatar from "@/assets/icons/user_avatar.svg";

// Hooks
import { useUserProfile, useRecentCommentsByUser } from "@/app/_lib/hooks";

const ProfileView: React.FC = () => {
  // State
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  // Fetch user profile using TanStack Query hook
  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();

  // Fetch user's recent comments using TanStack Query hook
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useRecentCommentsByUser(user?.username || "", 20, 0, !!user?.username);

  // Combined loading state
  const isLoading = profileLoading || commentsLoading;

  // Debug logging
  if (profileError) {
    console.error("Profile fetch error:", profileError);
  }
  if (user) {
    console.log("User profile data:", user);
  }

  const savedTopics: any[] = [];
  const wordsOfWisdm: any[] = [];

  const toggleSettings = () => {
    setShowSettings(!showSettings);
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

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Loading...";

  // Show error state if profile fails to load
  if (profileError) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <BaseHeader title="Profile" variant="dashboard" />
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Error Loading Profile</h2>
            <p>
              {profileError instanceof Error
                ? profileError.message
                : "Failed to load user profile"}
            </p>
            <p>Please try refreshing the page or logging in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <BaseHeader
          title="Profile"
          variant="dashboard"
          actionButton={{
            label: "Edit",
            onClick: toggleSettings,
            className: styles.editButton,
          }}
        />
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            <Image
              src={user?.photo_url || placeholderAvatar}
              alt={`${user?.username || "User"}'s avatar`}
              width={80}
              height={80}
            />
          </div>
          <div className={styles.userInfo}>
            <h2>
              {user?.name ||
                user?.username ||
                (profileLoading ? "Loading..." : "No name")}
            </h2>
            <p>Joined {joinedDate}</p>
            <div className={styles.tagContainer}>
              {user?.traits?.map((trait, index) => (
                <div
                  key={trait.id || index}
                  className={`${styles.tagItem} ${
                    styles[`active${trait.class_name}`]
                  }`}
                >
                  {trait.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <ProfileTabs
          comments={comments}
          savedTopics={savedTopics}
          wisdmList={wordsOfWisdm}
          quadrantData={{ xValue: 0.7, yValue: 0.6 }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Components */}
      <UserSettings
        user={userSettingsData}
        onBack={toggleSettings}
        isOpen={showSettings}
      />
      <div className={styles.scrollableContent}>
        {isLoading ? (
          <div className={styles.spinnerWrapper}>
            <LoadingSpinner />
          </div>
        ) : (
          <ProfileTabs.Content
            activeTab={activeTab}
            comments={comments}
            savedTopics={savedTopics}
            wisdmList={wordsOfWisdm}
            quadrantData={{ xValue: 0.7, yValue: 0.6 }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileView;
