"use client";

import React, { useEffect, useReducer, useState } from "react";

import { socket } from "@/app/_lib/socket/socket";

// Components
import RecursiveCommentDisplay from "../RecursiveCommentDisplay/RecursiveCommentDisplay";
import RootCommentInput from "../RootCommentInput/RootCommentInput";
import LoadingComments from "../../loading/LoadingComments/LoadingComments";
import MainCommentDisplay from "../MainCommentDisplay/MainCommentDisplay";

// Hooks
import { useCommentThread } from "@/app/_lib/hooks";

// Reducer
import {
  commentReducer,
  INIT_COMMENT_THREAD,
  CommentOrder,
} from "./commentReducer";

import styles from "@/app/_components/comments/CommentContainer/CommentContainer.module.scss";

interface CommentContainerProps {
  threadId: string;
  rootCommentId: string;
  threadType: string;
  displayMainComment?: boolean;
}

interface ButtonProp {
  name: CommentOrder;
  text: string;
}

const CommentContainer: React.FC<CommentContainerProps> = ({
  threadId,
  rootCommentId,
  threadType,
  displayMainComment = false,
}) => {
  const [commentState, commentDispatch] = useReducer(
    commentReducer,
    INIT_COMMENT_THREAD
  );
  const [orderBy, setOrderBy] = useState<CommentOrder>("DESC");

  const orderByButtonArray: ButtonProp[] = [
    { name: "ASC", text: "oldest" },
    { name: "DESC", text: "newest" },
  ];

  // Fetch comment thread using TanStack Query hook
  const {
    data: commentThread,
    isLoading,
    refetch,
  } = useCommentThread(
    threadId,
    rootCommentId,
    {
      order_by: orderBy,
      offset: 0,
      limit: 20,
      reference_type: threadType,
    },
    true
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (commentThread) {
      commentDispatch({
        type: "setThread",
        payload: { commentThread, order: orderBy, reset: true },
      });
    }
  }, [commentThread, orderBy]);

  // Refetch when order changes
  useEffect(() => {
    refetch();
  }, [orderBy, refetch]);

  // Helper function for recursive comment loading
  const handleGetComments = async (
    commentId: string,
    offset: number = 0,
    reset = false,
    cb = () => null,
    limit: number = 20
  ) => {
    // This function is still needed for recursive comment loading
    // but now it uses the refetch from the hook
    await refetch();
    cb();
  };

  useEffect(() => {
    if (!socket) return; // Guard against null socket

    socket.on("receive_comment", (response) => {
      const {
        comment,
        parent_comment,
        comment_count_total,
        root_comment_count,
      } = response;

      commentDispatch({
        type: "addComment",
        payload: {
          ...response,
          order: orderBy,
        },
      });
    });

    return () => {
      if (!socket) return;
      socket.off("receive_comment");
    };
  }, [orderBy]);

  useEffect(() => {
    if (!socket) return; // Guard against null socket

    socket.on("receive_comment_update", (response) => {
      let updatedComment = response;
      if ("vote" in response) {
        updatedComment = { ...response, is_vote_bouncing: false };
      }
      commentDispatch({
        type: "updateComment",
        payload: {
          comment: updatedComment,
        },
      });
    });

    return () => {
      if (!socket) return;
      socket.off("receive_comment_update");
    };
  }, []);

  return (
    <div id="comment_container" className={styles.commentContainer}>
      {!commentState.comments?.[rootCommentId] ? (
        <LoadingComments additionalText="From your mom..." />
      ) : (
        <>
          {commentState.comments?.root && displayMainComment && (
            <MainCommentDisplay
              comment={commentState.comments.root}
              commentDispatch={commentDispatch}
            />
          )}
          {orderByButtonArray.map((button) => {
            const { name, text } = button;
            return (
              <button
                key={text}
                onClick={() => (name !== orderBy ? setOrderBy(name) : null)}
                style={{
                  opacity: orderBy === name ? 0.5 : 1,
                  cursor: orderBy === name ? "not-allowed" : "pointer",
                  margin: "0 7.5px 25px 0",
                  padding: "5px 10px",
                  color: "var(--color-bg)",
                  backgroundColor: "var(--color-font-body)",
                  border: "1px solid var(--color-comment-font)",
                  borderRadius: "10px",
                }}
              >
                {text}
              </button>
            );
          })}
          {commentState.comments[rootCommentId] && (
            <RecursiveCommentDisplay
              commentsObject={commentState.comments}
              commentObject={commentState.comments[rootCommentId]}
              threadId={threadId}
              parentCollapsed={false}
              orderBy={orderBy}
              handleGetComments={handleGetComments}
              parentCommentCount={
                rootCommentId === threadId
                  ? commentState.root_comment_count
                  : commentState.comments.root?.comment_count
              }
              commentId={rootCommentId}
              commentDispatch={commentDispatch}
              threadType={threadType}
            />
          )}
          <RootCommentInput
            threadId={threadId}
            parentCommentId={rootCommentId}
            threadType={threadType}
          />
        </>
      )}
    </div>
  );
};

export default CommentContainer;
