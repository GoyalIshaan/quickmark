import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CommentInput } from "@ishaan_goyal/quickmark-common";

export interface Comment {
  id: string;
  title: string;
  content: string;
  blogId: string;
  authorId: string;
  createdAt: string;
}

interface PostCommentResult {
  loading: boolean;
  postComment: (args: CommentInput) => Promise<string>;
  error: string | null;
}

interface PutCommentResult {
  loading: boolean;
  updateComment: (args: CommentInput) => Promise<string>;
  error: string | null;
}

interface getComment {
  loading: boolean;
  comments: Comment[];
  refetchComments: () => void;
}

const useGetComment = ({ blogId }: { blogId: string }): getComment => {
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);

  const getComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/comment/${blogId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setComments(response.data.comments);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  return { loading, comments, refetchComments: getComments };
};

const usePostComment = (refetchComments: () => void): PostCommentResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postComment = async ({ id, title, content }: CommentInput) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/comment/`,
        { id, title, content },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
      refetchComments();
      return "Comment posted";
    } catch (error) {
      setLoading(false);
      setError("Couldn't post the Comment");
      throw error;
    }
  };

  return { loading, postComment, error };
};

const useUpdateComment = (refetchComments: () => void): PutCommentResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateComment = async ({
    id,
    title,
    content,
  }: CommentInput): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/comment/`,
        { id, title, content },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      refetchComments();
      console.log("Edited the comment");
      return response.data.id;
    } catch (error) {
      setLoading(false);
      setError("Couldn't edit the Comment");
      throw error;
    }
  };

  return { loading, updateComment, error };
};

const useDeleteComment = (refetchComments: () => void) => {
  const deleteComment = async (commentId: string) => {
    try {
      const URL = `${BACKEND_URL}/api/v1/comment/${commentId}/`;
      console.log("URL", URL);
      await axios.delete(URL, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("Comment deleted");
      refetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  return { deleteComment };
};

export { usePostComment, useGetComment, useUpdateComment, useDeleteComment };
