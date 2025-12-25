"use client";

// System Imports
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

// API/Database Imports
import placeholderData from "@/assets/placeholderData.json";

// Component Imports
import BaseHeader from "@/app/_components/header";
import BaseCard from "@/app/_components/cards/BaseCard";
import cardStyles from "@/app/_components/cards/BaseCard.module.scss";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/vote/Vote.module.scss";

// Asset Imports
import explore_feed_1 from "@/assets/images/explore_feed_1.png";
import explore_feed_2 from "@/assets/images/explore_feed_2.png";

const imageMap: { [key: string]: any } = {
  "explore_feed_1.png": explore_feed_1,
  "explore_feed_2.png": explore_feed_2,
};

interface VoteItem {
  id: string;
  image: string;
  title: string;
  description: string;
  vote: boolean | null;
}

const VoteView = () => {
  const [voteItems, setVoteItems] = useState<VoteItem[]>(
    placeholderData.voteItems
  );

  const handleVote = (id: string, vote: boolean) => {
    setVoteItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, vote: vote } : item))
    );
  };

  return (
    <div className={styles.pageContainer}>
      <BaseHeader title="Vote" variant="dashboard" />
      <div className={styles.pageWrapper}>
        <p>Vote on the hottest takes 🔥</p>
        {voteItems.map((item) => {
          const VoteCardInline = () => {
            const [cardState, setCardState] = useState<
              "idle" | "revealed" | "voted"
            >(item.vote === null ? "idle" : "voted");
            const [votedValue, setVotedValue] = useState<boolean | null>(
              item.vote
            );

            const handleClick = () => {
              if (cardState === "idle") setCardState("revealed");
              else if (cardState === "revealed") setCardState("idle");
            };

            const handleVoteClick = (voteValue: boolean) => {
              setVotedValue(voteValue);
              setCardState("voted");
              setTimeout(() => handleVote(item.id, voteValue), 400);
            };

            const imageSource = imageMap[item.image] || explore_feed_1;

            return (
              <BaseCard variant="vote" onClick={handleClick}>
                <motion.div className={cardStyles.imageContainer}>
                  <Image
                    src={imageSource}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className={cardStyles.overlay}></div>
                </motion.div>
                <div className={cardStyles.cardContent}>
                  <AnimatePresence mode="wait">
                    {cardState === "idle" && (
                      <motion.h2
                        key="title"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.title}
                      </motion.h2>
                    )}
                    {cardState === "revealed" && (
                      <motion.div
                        key="reveal"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cardStyles.voteContainer}
                      >
                        <motion.button
                          className={cardStyles.voteButton}
                          whileTap={{ scale: 1.2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVoteClick(true);
                          }}
                        >
                          👍
                        </motion.button>
                        <motion.h4 className={cardStyles.cardBody}>
                          {item.description}
                        </motion.h4>
                        <motion.button
                          className={cardStyles.voteButton}
                          whileTap={{ scale: 1.2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVoteClick(false);
                          }}
                        >
                          👎
                        </motion.button>
                      </motion.div>
                    )}
                    {cardState === "voted" && votedValue !== null && (
                      <motion.div
                        key="voted"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className={cardStyles.voteFinishedContainer}
                      >
                        <motion.span
                          initial={{ y: votedValue ? 40 : -40, scale: 0.8 }}
                          animate={{ y: 0, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          style={{ fontSize: "48px", lineHeight: "1" }}
                        >
                          {votedValue ? "👍" : "👎"}
                        </motion.span>
                        <motion.h4
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          You voted {votedValue ? "thumbs up" : "thumbs down"}{" "}
                          to "{item.title}"
                        </motion.h4>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </BaseCard>
            );
          };

          return <VoteCardInline key={item.id} />;
        })}
      </div>
    </div>
  );
};

export default VoteView;
