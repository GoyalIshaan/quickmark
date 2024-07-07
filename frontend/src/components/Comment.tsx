import React from "react";
import { Comment } from "../hooks/useComments";
import CommentItem from "./CommentItem";

interface CommentsListProps {
  comments: Comment[];
  refetchComments: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  refetchComments,
}) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          refetchComments={refetchComments}
        />
      ))}
    </div>
  );
};

export default CommentsList;
