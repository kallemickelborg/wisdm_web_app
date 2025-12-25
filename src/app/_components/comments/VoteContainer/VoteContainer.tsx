import React, { useState, useEffect, Dispatch } from "react";

import Image from "next/image";
import upVote from "@/assets/icons/upvote.svg";
import upVoteFill from "@/assets/icons/upvote_fill.svg";
import styles from "@/app/_components/comments/VoteContainer/VoteContainer.module.scss";

import { useAuth } from "@/app/_lib/hooks/useAuth";
import { socket } from "@/app/_lib/socket/socket";

import type { Comment } from "@/models";
import { CommentActions } from "../CommentContainer/commentReducer";
import { standardizedPath } from "@/app/_lib/utils/path";

interface VoteContainerProps {
  threadId: string;
  comment: Comment;
  commentDispatch: Dispatch<CommentActions>;
}

const VoteContainer: React.FC<VoteContainerProps> = ({
  threadId,
  comment,
  commentDispatch,
}) => {
  const { idToken } = useAuth();
  const { vote, upvote_count, downvote_count, id, is_vote_bouncing } = comment;
  const vote_count = (upvote_count || 0) - (downvote_count || 0);

  const path = standardizedPath();

  const updateIsVoteBouncing = (isBouncing: boolean, comment: Comment) => {
    const newComment = { ...comment, is_vote_bouncing: isBouncing };
    commentDispatch({
      type: "updateComment",
      payload: {
        comment: newComment,
      },
    });
  };

  const onClickUpdateVote = (e: React.MouseEvent, newValue: boolean | null) => {
    e.preventDefault();
    if (!is_vote_bouncing) {
      updateIsVoteBouncing(true, comment);
      if (socket) {
        socket.emit("send_vote_update", {
          room: threadId,
          vote: newValue,
          comment,
          path: path,
          token: idToken,
        });
      }
    }
  };
  return (
    <div
      className={styles.voteContainer}
      style={{
        opacity: is_vote_bouncing ? 0.5 : 1,
      }}
    >
      <Image
        src={vote ? upVoteFill : upVote}
        alt="up vote arrow"
        height={20}
        width={20}
        className={styles.voteArrow}
        style={{
          cursor: "pointer",
        }}
        onClick={(e) => onClickUpdateVote(e, vote ? null : true)}
      />
      <span className={styles.voteCount}>{vote_count}</span>
      <Image
        src={vote === false ? upVoteFill : upVote}
        alt="down vote arrow"
        height={20}
        width={20}
        className={`${styles.voteArrow} ${styles.downvote}`}
        style={{
          cursor: "pointer",
        }}
        onClick={(e) => onClickUpdateVote(e, vote === false ? null : false)}
      />
    </div>
  );
};

export default VoteContainer;
