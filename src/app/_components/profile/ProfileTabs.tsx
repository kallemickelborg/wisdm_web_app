// System Imports
import React from "react";

// API/Database Imports
import { User, SavedTopic, Wisdm, Comment } from "@/types";

// Component Imports
import BaseCard from "@/app/_components/cards/BaseCard";
import Quadrant from "@/app/_components/graph/Quadrant";

// Asset Imports
import savedTopics_1 from "@/assets/images/savedTopics_1.png";
import userAvatarIcon from "@/assets/icons/user_avatar.svg";
import upvoteIcon from "@/assets/icons/upvote.svg";
import commentIcon from "@/assets/icons/comment.svg";
import Image from "next/image";

// Import BaseCard styles for comment variant
import cardStyles from "@/app/_components/cards/BaseCard.module.scss";

const imageMap: { [key: string]: any } = {
  "/savedTopics_1.png": savedTopics_1,
};

// Stylesheet Imports
import styles from "@/app/_components/profile/ProfileTabs.module.scss";

const CommentsTab: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  return (
    <div className={styles.pageWrapper}>
      {comments.map((comment, index) => (
        <BaseCard
          key={index}
          variant="activity"
          title={comment.timeline_title}
          content={comment.body}
          metadata={{
            upvotes: comment.vote_count || 0,
            comments: comment.comment_count || 0,
          }}
        />
      ))}
    </div>
  );
};

const QuadrantTab: React.FC<{
  quadrantData: { xValue: number; yValue: number };
}> = ({ quadrantData }) => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.quadrantContainer}>
        <Quadrant xValue={quadrantData.xValue} yValue={quadrantData.yValue} />
      </div>
    </div>
  );
};

const SavedTopicsTab: React.FC<{ topics: SavedTopic[] }> = ({ topics }) => {
  return (
    <div className={styles.pageWrapper}>
      {topics.map((topic) => {
        const image = imageMap[topic.imageUrl] || savedTopics_1;
        return (
          <BaseCard
            key={topic.id}
            variant="topic"
            image={image}
            imagePosition="top"
            showOverlay={true}
            title={topic.title}
            content={topic.body}
            metadata={{ comments: topic.comments }}
          />
        );
      })}
    </div>
  );
};

const WordsOfWisdmTab: React.FC<{ wisdmList: Wisdm[] }> = ({ wisdmList }) => {
  return (
    <div className={styles.pageWrapper}>
      {wisdmList.map((wisdm, index) => {
        const [imgSrc, setImgSrc] = React.useState(
          wisdm.user_photo_url || userAvatarIcon
        );
        const timeDiff = wisdm.created_at
          ? Math.floor(
              (Date.now() - new Date(wisdm.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;
        const timeString = `${timeDiff}d ago`;

        return (
          <BaseCard key={index} variant="comment">
            {wisdm.timeline_title && <h3>{wisdm.timeline_title}</h3>}
            <div className={cardStyles.commentContent}>
              <div className={cardStyles.userWrapper}>
                <div className={cardStyles.userName}>
                  <div className={cardStyles.userIcon}>
                    <Image
                      src={imgSrc}
                      width={40}
                      height={40}
                      alt={`${wisdm.username}'s avatar`}
                      onError={() => setImgSrc(userAvatarIcon)}
                    />
                  </div>
                  <span>
                    {wisdm.username} • {timeString}
                  </span>
                </div>
              </div>
              <p>{wisdm.body}</p>
            </div>
            <div className={cardStyles.commentFooter}>
              <div className={cardStyles.commentContainer}>
                <div className={cardStyles.commentVotes}>
                  <Image
                    src={upvoteIcon}
                    className={cardStyles.upvoteIcon}
                    alt="Upvote"
                  />
                  <span>{wisdm.vote_count || 0}</span>
                  <Image
                    src={upvoteIcon}
                    className={cardStyles.downvoteIcon}
                    alt="Downvote"
                  />
                </div>
              </div>
              <div className={cardStyles.commentCount}>
                <Image src={commentIcon} alt="Comment" />
                <span>{wisdm.comment_count || 0} comments</span>
              </div>
            </div>
          </BaseCard>
        );
      })}
    </div>
  );
};

interface ProfileTabsProps {
  comments: Comment[];
  savedTopics: SavedTopic[];
  wisdmList: Wisdm[];
  quadrantData: {
    xValue: number;
    yValue: number;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface ProfileTabsContentProps {
  activeTab: string;
  comments: Comment[];
  savedTopics: SavedTopic[];
  wisdmList: Wisdm[];
  quadrantData: {
    xValue: number;
    yValue: number;
  };
}

const ProfileTabsContent: React.FC<ProfileTabsContentProps> = ({
  activeTab,
  comments,
  savedTopics,
  wisdmList,
  quadrantData,
}) => {
  console.log("Active tab:", activeTab);
  return (
    <div className={styles.tabContent}>
      {activeTab === "comments" && <CommentsTab comments={comments} />}
      {activeTab === "quadrant" && <QuadrantTab quadrantData={quadrantData} />}
      {activeTab === "savedTopics" && <SavedTopicsTab topics={savedTopics} />}
      {activeTab === "wordsOfWisdm" && (
        <WordsOfWisdmTab wisdmList={wisdmList} />
      )}
    </div>
  );
};

const ProfileTabs: React.FC<ProfileTabsProps> & {
  Content: React.FC<ProfileTabsContentProps>;
} = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabContainer}>
      <div
        className={`${styles.tabItem} ${
          activeTab === "comments" ? styles.activeTab : ""
        }`}
        onClick={() => setActiveTab("comments")}
      >
        Comments
      </div>
      <div
        className={`${styles.tabItem} ${
          activeTab === "quadrant" ? styles.activeTab : ""
        }`}
        onClick={() => setActiveTab("quadrant")}
      >
        Quadrant
      </div>
      <div
        className={`${styles.tabItem} ${
          activeTab === "savedTopics" ? styles.activeTab : ""
        }`}
        onClick={() => setActiveTab("savedTopics")}
      >
        Saved Interests
      </div>
      <div
        className={`${styles.tabItem} ${
          activeTab === "wordsOfWisdm" ? styles.activeTab : ""
        }`}
        onClick={() => setActiveTab("wordsOfWisdm")}
      >
        Words of Wisdm
      </div>
    </div>
  );
};

ProfileTabs.Content = ProfileTabsContent;

export default ProfileTabs;
