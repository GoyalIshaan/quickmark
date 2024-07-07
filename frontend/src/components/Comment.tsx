import React from "react";
import { Comment } from "../hooks/useComments";
import CommentItem from "./CommentItem";

const CommentsList: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsList;
