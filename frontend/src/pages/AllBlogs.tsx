import React from "react";
import BlogCard from "../components/BlogCard";
import { useBlogs } from "../hooks/useBlogs";
import BlogCardSkeleton from "../components/BlogCardSkeleton";

const AllBlogs: React.FC = () => {
  const { loading, blogs } = useBlogs();

  if (loading) return <BlogCardSkeleton />;
  if (!blogs || blogs.length === 0) return <div>No blogs found.</div>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          id={blog.id}
          authorName={blog.author.name || "Anonymous"}
          title={blog.title}
          content={blog.content}
          publishedAt={blog.createdAt}
        />
      ))}
    </div>
  );
};

export default AllBlogs;
