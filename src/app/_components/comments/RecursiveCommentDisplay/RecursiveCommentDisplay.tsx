import React, { useState, Dispatch, SetStateAction } from "react";
import type {
  Comment,
  CommentsByParentId,
  CommentGroupByIndex,
} from "@/models";
import { CommentOrder } from "../CommentContainer/commentReducer";
import CommentBody from "../CommentBody/CommentBody";
import NestedThreadContainer from "../NestedThreadContainer/NestedThreadContainer";
import styles from "./RecursiveCommentDisplay.module.scss";
import LoadingOverlay from "../../loading/LoadingOverlay";

import { CommentActions } from "../CommentContainer/commentReducer";

import CommentObserver from "../CommentObserver/CommentObserver";

export type HandleGetComments = (
  commentId: string,
  offset: number,
  reset?: boolean,
  cb?: () => any
) => void;

export interface RecursiveCommentDisplayProps {
  commentsObject: CommentsByParentId;
  commentObject: CommentGroupByIndex;
  commentId: string;
  threadId: string;
  parentCollapsed: boolean;
  orderBy: CommentOrder;
  depth?: number;
  handleGetComments: HandleGetComments;
  parentCommentCount?: number;
  commentDispatch: Dispatch<CommentActions>;
  threadType: string;
}

const RecursiveCommentDisplay: React.FC<RecursiveCommentDisplayProps> =
  React.memo(
    ({
      commentsObject,
      commentObject,
      threadId,
      parentCollapsed,
      orderBy,
      depth = 0,
      handleGetComments,
      parentCommentCount = 0,
      commentId,
      commentDispatch,
      threadType,
    }) => {
      const [isLoadingMoreComments, setIsLoadingMoreComments] =
        useState<boolean>(false);

      return (
        <div>
          {Object.values(commentObject).map((comment: Comment, index) => {
            const { id, body, comment_count, parent_id } = comment;
            return (
              <div className={styles.commentContainer} key={id}>
                <CommentObserver
                  onIntersect={handleGetComments}
                  index={index}
                  currentCommentObjectLength={
                    Object.values(commentObject).length
                  }
                  parent_id={parent_id}
                  parent_comment_count={parentCommentCount}
                  body={body}
                  isLoadingMoreComments={isLoadingMoreComments}
                  setIsLoadingMoreComments={setIsLoadingMoreComments}
                >
                  <CommentBody
                    comment={comment}
                    threadId={threadId}
                    commentDispatch={commentDispatch}
                    threadType={threadType}
                  />
                </CommentObserver>
                <NestedThreadContainer
                  comment_count={comment_count ?? 0}
                  parentCollapsed={parentCollapsed}
                  commentsObject={commentsObject}
                  commentObject={commentsObject[id]}
                  commentId={id}
                  threadId={threadId}
                  orderBy={orderBy}
                  depth={depth + 1}
                  handleGetComments={handleGetComments}
                  parentCommentCount={comment_count ?? 0}
                  commentDispatch={commentDispatch}
                  threadType={threadType}
                />
              </div>
            );
          })}
          {isLoadingMoreComments && <LoadingOverlay />}
        </div>
      );
    }
  );

export default RecursiveCommentDisplay;
