import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { BACKEND_URL } from "../config";

interface BlogPostResponse {
  id: string;
}

interface PostBlogResult {
  loading: boolean;
  postBlog: (title: string, content: string) => Promise<string>;
  error: string | null;
}

const usePostBlog = (): PostBlogResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postBlog = async (title: string, content: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<BlogPostResponse> = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
      return response.data.id;
    } catch (error) {
      setLoading(false);
      setError("Couldn't post the blog");
      console.error("Error posting blog:", error);
      throw error;
    }
  };

  return { loading, postBlog, error };
};

export default usePostBlog;
