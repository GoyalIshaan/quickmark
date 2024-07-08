import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface UseBlogsResult {
  loading: boolean;
  blog: Blog;
}

const useBlog = ({ id }: { id: string }): UseBlogsResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setBlog(res.data.blog);
        setLoading(false);
      });
  }, [id]);

  if (blog === undefined) {
    console.log("blog is undefined");
    return {
      loading,
      blog: {
        id: "",
        title: "",
        content: "",
        author: { id: "", name: "" },
        createdAt: "",
      },
    };
  }
  return { loading, blog };
};

export default useBlog;
