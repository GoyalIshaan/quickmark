import React from "react";
import BlogCard from "../components/BlogCard";
import { useBlogs } from "../hooks/useBlogs";
import BlogCardSkeleton from "../components/BlogCardSkeleton";

const AllBlogs: React.FC = () => {
  const { loading, blogs, totalPages, currentPage, setPage } = useBlogs();

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

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
      <div className="flex justify-between items-center my-10">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
            currentPage === 1
              ? "bg-white text-black border-2 border-black cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 my-12 rounded-md font-semibold transition-colors duration-300 ${
            currentPage === totalPages
              ? "bg-white text-black border-2 border-black cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBlogs;
