"use client";

// System Imports
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useAnimation, useMotionValue } from "motion/react";

// Component Imports
import BaseCard from "@/app/_components/cards/BaseCard";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";
import BaseHeader from "@/app/_components/header";

// Asset Imports for Comment Cards
import upvoteIcon from "@/assets/icons/upvote.svg";
import commentIcon from "@/assets/icons/comment.svg";
import userAvatarIcon from "@/assets/icons/user_avatar.svg";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/explore/Explore.module.scss";
import cardStyles from "@/app/_components/cards/BaseCard.module.scss";

// Asset Imports
import featuredImage1 from "@/assets/images/explore_feed_1.png";
import featuredImage2 from "@/assets/images/explore_feed_2.png";
import featuredImage3 from "@/assets/images/explore_feed_3.png";
import featuredImage4 from "@/assets/images/explore_feed_4.png";
import featuredImage5 from "@/assets/images/explore_feed_5.png";
import featuredImage6 from "@/assets/images/explore_feed_6.png";

// Hooks
import { useTrendingComments } from "@/app/_lib/hooks";

const ExploreView = () => {
  // Fetch trending comments using TanStack Query hook
  const { data: trendingComments = [], isLoading: trendingLoading } =
    useTrendingComments(10);

  const featuredTimelines = [
    { id: 1, image: featuredImage1, title: "Timeline 1" },
    { id: 2, image: featuredImage2, title: "Timeline 2" },
    { id: 3, image: featuredImage3, title: "Timeline 3" },
    { id: 4, image: featuredImage4, title: "Timeline 4" },
    { id: 5, image: featuredImage5, title: "Timeline 5" },
    { id: 6, image: featuredImage6, title: "Timeline 6" },
  ];

  const carouselItems = [...featuredTimelines, ...featuredTimelines];

  const [carouselWidth, setCarouselWidth] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const controls = useAnimation();

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayTriggerPosition, setOverlayTriggerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const toggleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOverlayVisible) {
      setOverlayTriggerPosition({ x: e.clientX, y: e.clientY });
    }
    setIsOverlayVisible(!isOverlayVisible);
  };

  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const xRef = useRef(0);

  // Combined loading state
  const isLoading = trendingLoading;

  useEffect(() => {
    if (containerRef) {
      setCarouselWidth(containerRef.scrollWidth / 2);
    }
  }, [containerRef, featuredTimelines.length]);

  useEffect(() => {
    let animationFrame: number;
    function animate() {
      if (!isDragging && carouselWidth > 0) {
        const speed = 0.5;
        let nextX = x.get() - speed;
        if (Math.abs(nextX) >= carouselWidth) {
          nextX = 0;
        }
        x.set(nextX);
        xRef.current = nextX;
      }
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [carouselWidth, isDragging, x]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // After drag, sync xRef to the current x value
    let currentX = x.get();
    if (Math.abs(currentX) >= carouselWidth) {
      currentX = currentX % carouselWidth;
      x.set(currentX);
    }
    xRef.current = currentX;
    setIsDragging(false);
  };

  return (
    <div className={styles.pageContainer}>
      <BaseHeader
        title="Explore"
        variant="dashboard"
        modal={{
          isVisible: isOverlayVisible,
          onToggle: toggleOverlay,
          triggerPosition: overlayTriggerPosition,
          onClose: () => setIsOverlayVisible(false),
        }}
        search={{ show: true }}
        settings="gear"
      />
      <section className={styles.pageWrapper}>
        <div className={styles.sectionTitle}>
          <h2>Featured 🔍</h2>
          <a href="#" className={styles.seeAll}>
            SEE ALL
          </a>
        </div>
        <div className={styles.exploreFeedContainer}>
          {isLoading ? (
            <div className={styles.spinnerWrapper}>
              <LoadingSpinner />
            </div>
          ) : (
            <motion.div
              className={styles.exploreFeed}
              ref={setContainerRef}
              drag="x"
              dragConstraints={{ left: -carouselWidth, right: 0 }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{ x, cursor: isDragging ? "grabbing" : "grab" }}
            >
              {carouselItems.map((item, index) => (
                <BaseCard
                  key={`carousel-${index}`}
                  variant="explore"
                  image={item.image}
                  imagePosition="background"
                >
                  <Image
                    src={item.image}
                    alt={`Featured ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    draggable={false}
                  />
                </BaseCard>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      <div className={styles.sectionTitle}>
        <h2>Weekly Words of Wisdm 💬</h2>
      </div>
      <section className={styles.pageWrapper}>
        {isLoading ? (
          <div className={styles.spinnerWrapper}>
            <LoadingSpinner />
          </div>
        ) : trendingComments.length > 0 ? (
          trendingComments.map((comment) => {
            const {
              id,
              body,
              username,
              created_at,
              vote_count,
              comment_count,
              user_photo_url,
              timeline_title,
            } = comment;

            const timeDiff = created_at
              ? Math.floor(
                  (Date.now() - new Date(created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0;
            const timeString = `${timeDiff}d ago`;
            const [imgSrc, setImgSrc] = React.useState(
              user_photo_url || userAvatarIcon
            );

            return (
              <BaseCard key={id} variant="comment">
                {timeline_title && <h3>{timeline_title}</h3>}
                <div className={cardStyles.commentContent}>
                  <div className={cardStyles.userWrapper}>
                    <div className={cardStyles.userName}>
                      <div className={cardStyles.userIcon}>
                        <Image
                          src={imgSrc}
                          width={40}
                          height={40}
                          alt={`${username}'s avatar`}
                          onError={() => setImgSrc(userAvatarIcon)}
                        />
                      </div>
                      <span>
                        {username} • {timeString}
                      </span>
                    </div>
                  </div>
                  <p>{body}</p>
                </div>
                <div className={cardStyles.commentFooter}>
                  <div className={cardStyles.commentContainer}>
                    <div className={cardStyles.commentVotes}>
                      <Image
                        src={upvoteIcon}
                        className={cardStyles.upvoteIcon}
                        alt="Upvote"
                      />
                      <span>{vote_count || 0}</span>
                      <Image
                        src={upvoteIcon}
                        className={cardStyles.downvoteIcon}
                        alt="Downvote"
                      />
                    </div>
                  </div>
                  <div className={cardStyles.commentCount}>
                    <Image src={commentIcon} alt="Comment" />
                    <span>{comment_count || 0} comments</span>
                  </div>
                </div>
              </BaseCard>
            );
          })
        ) : (
          <div className={styles.emptyStateMessage}>
            Nothing interesting has been happening this last week
          </div>
        )}
      </section>
    </div>
  );
};

export default ExploreView;
