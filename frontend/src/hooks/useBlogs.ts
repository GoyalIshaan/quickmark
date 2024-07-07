import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
}

interface UseBlogsResult {
  loading: boolean;
  blogs: Blog[];
}

const useBlogs = (): UseBlogsResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBlogs(res.data.blogs);
        setLoading(false);
      });
  }, []);

  return { loading, blogs };
};

const useGetBlogsByAuthor = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorBlogs, setAuthorBlogs] = useState<Blog[]>([]);

  const fetchAuthorBlogs = useCallback(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/blog/author/`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setAuthorBlogs(res.data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching author blogs:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAuthorBlogs();
  }, [fetchAuthorBlogs]);

  return { loading, authorBlogs, refetchAuthorBlogs: fetchAuthorBlogs };
};

const useDeleteBlog = () => {
  const deleteBlog = async (blogId: string, onSuccess?: () => void) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("Blog deleted");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return { deleteBlog };
};

const useUpdateBlogPost = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const updateBlog = async (id: string, title: string, content: string) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog`,
        { id, title, content },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
      return response.data.id;
    } catch (error) {
      console.error("Error editing blog:", error);
      throw error;
    }
  };
  return { loading, updateBlog };
};

export { useBlogs, useGetBlogsByAuthor, useDeleteBlog, useUpdateBlogPost };
