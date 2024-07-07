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

const getAuthHeader = () => ({
  Authorization: localStorage.getItem("token"),
});

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

const useLikeBlog = (blogId: string) => {
  const likeBlog = useCallback(async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/like/${blogId}/`,
        {},
        { headers: getAuthHeader() }
      );
      console.log("Blog liked");
    } catch (error) {
      console.error("Error liking blog:", error);
      throw error;
    }
  }, [blogId]);

  return { likeBlog };
};

const useUnlikeBlog = (blogId: string) => {
  const unlikeBlog = useCallback(async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/unlike/${blogId}/`,
        {},
        { headers: getAuthHeader() }
      );
      console.log("Blog unliked");
    } catch (error) {
      console.error("Error unliking blog:", error);
      throw error;
    }
  }, [blogId]);

  return { unlikeBlog };
};

const useGetNumberOfLikes = (blogId: string) => {
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLikes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/blog/likes/${blogId}/`
      );
      setLikes(res.data.number);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  return { likes, refetchLikes: fetchLikes, loading };
};

const useLikedByUser = (blogId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkIfLiked = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/user/like/${blogId}/`,
        {
          headers: getAuthHeader(),
        }
      );
      setIsLiked(res.data.liked);
      return res.data.liked;
    } catch (error) {
      console.error("Error checking if blog is liked:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    checkIfLiked();
  }, [checkIfLiked]);

  return { isLiked, checkIfLiked, loading };
};

const useSaveBlog = (blogId: string) => {
  const saveBlog = useCallback(async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/save/${blogId}/`,
        {},
        { headers: getAuthHeader() }
      );
      console.log("Blog saved");
    } catch (error) {
      console.error("Error saving blog:", error);
      throw error;
    }
  }, [blogId]);
  return { saveBlog };
};

const useUnsaveBlog = (blogId: string) => {
  const unsaveBlog = useCallback(async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/unsave/${blogId}/`,
        {},
        { headers: getAuthHeader() }
      );
      console.log("Blog unsaved");
    } catch (error) {
      console.error("Error in unsaving blog:", error);
      throw error;
    }
  }, [blogId]);
  return { unsaveBlog };
};

const useGetNumberOfSaves = (blogId: string) => {
  const [saves, setSaves] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/blog/saved/${blogId}/`
      );
      setSaves(res.data.number);
    } catch (error) {
      console.error("Error fetching saves:", error);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchSaves();
  }, [fetchSaves]);

  return { saves, refetchSaves: fetchSaves, loading };
};

const useSavedByUser = (blogId: string) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkIfSaved = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/user/save/${blogId}/`,
        {
          headers: getAuthHeader(),
        }
      );
      setSaved(res.data.saved);
      return res.data.saved;
    } catch (error) {
      console.error("Error checking if blog is saved:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    checkIfSaved();
  }, [checkIfSaved]);

  return { saved, checkIfSaved, loading };
};

const useGetSavedBlogs = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);

  const fetchSavedBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/save/`, {
        headers: getAuthHeader(),
      });
      console.log("Saved blogs:", response.data.savedBlogs.saved);
      setSavedBlogs(response.data.savedBlogs.saved);
    } catch (error) {
      console.error("Error fetching saved blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedBlogs();
  }, [fetchSavedBlogs]);

  const refetchSavedBlogs = useCallback(() => {
    fetchSavedBlogs();
  }, [fetchSavedBlogs]);

  return { loading, savedBlogs, refetchSavedBlogs };
};

export {
  useBlogs,
  useGetBlogsByAuthor,
  useDeleteBlog,
  useUpdateBlogPost,
  useGetNumberOfLikes,
  useLikeBlog,
  useUnlikeBlog,
  useLikedByUser,
  useSaveBlog,
  useUnsaveBlog,
  useGetNumberOfSaves,
  useSavedByUser,
  useGetSavedBlogs,
};
