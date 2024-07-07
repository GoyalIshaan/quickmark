import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CommentInput } from "@ishaan_goyal/quickmark-common";

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

export interface Comment {
  id: string;
  title: string;
  content: string;
  blogId: string;
  authorId: string;
  createdAt: string;
}

interface getComment {
  loading: boolean;
  comments: Comment[];
}

const usePostComment = (): PostCommentResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postComment = async ({
    id,
    title,
    content,
  }: CommentInput): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/comment/`,
        { id, title, content },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      return response.data.id;
    } catch (error) {
      setLoading(false);
      setError("Couldn't post the Comment");
      throw error;
    }
  };

  return { loading, postComment, error };
};

const useGetComment = ({ blogId }: { blogId: string }): getComment => {
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const getComments = async () => {
      await axios
        .get(`${BACKEND_URL}/api/v1/comment/${blogId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setComments(res.data.comments);
          setLoading(false);
        });
    };
    getComments();
    console.log("blogId", blogId);
  }, [blogId]);

  if (comments === undefined) {
    console.log("blog is undefined");
    return {
      loading,
      comments: [],
    };
  }
  return { loading, comments };
};

const useUpdateComment = (): PutCommentResult => {
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

export { usePostComment, useGetComment, useUpdateComment };
