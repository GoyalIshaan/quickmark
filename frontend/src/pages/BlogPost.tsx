import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useBlog from "../hooks/useBlog";
import BlogPostSkeleton from "../components/BlogPostSkeleton";
import { useGetComment, usePostComment } from "../hooks/useComments";
import Comments from "../components/Comment";
import CreateComment from "../components/CreateComment";
import CommentSkeleton from "../components/CommentSkeleton";
import { AnimatePresence } from "framer-motion";
import ShareButton from "../components/ShareButton";
import LikeButton from "../components/LikeButton";
import SaveButton from "../components/SaveButton";
import DOMPurify from "dompurify";
import katex from "katex";
import "katex/dist/katex.min.css";

// Added katex to window object for formula rendering
window.katex = katex;

const BlogPost: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { loading: blogLoading, blog } = useBlog({ id: id || "" });
  const [refetching, setRefetching] = useState(false);
  const {
    comments,
    loading: commentsLoading,
    refetchComments: originalRefetchComments,
  } = useGetComment({
    blogId: id || "",
  });

  const refetchComments = async () => {
    setRefetching(true);
    await originalRefetchComments();
    setRefetching(false);
  };

  const { postComment } = usePostComment(refetchComments);

  if (blogLoading) {
    return <BlogPostSkeleton />;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCommentSubmit = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    console.log("Comment submitted", id);
    await postComment({ id, title, content });
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    blog.author.name
  )}&background=random&length=1`;

  // Sanitize the blog content
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="md:w-2/3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <h1 className="text-4xl font-bold mb-2 sm:mb-0 break-words sm:max-w-[70%]">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <LikeButton blogId={id} />
              <SaveButton blogId={id} />
              <ShareButton blogId={id} />
            </div>
          </div>
          <div className="mb-6 text-gray-600">
            Posted on {formatDate(blog.createdAt)}
            <span className="ml-2 cursor-pointer">🔍</span>
          </div>
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <hr className="my-8 border-gray-300" />
          <h2 className="text-3xl font-bold mb-4">Comments</h2>
          <AnimatePresence>
            {commentsLoading || refetching ? (
              <CommentSkeleton />
            ) : comments.length === 0 ? (
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <Comments comments={comments} refetchComments={refetchComments} />
            )}
          </AnimatePresence>
        </div>
        <div className="md:w-1/3 mt-8 md:mt-0">
          <div className="sticky top-8">
            <Link to={`/author/${blog.author.id}`}>
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="flex items-center mb-4">
                  <img
                    src={avatarUrl}
                    alt="Author Avatar"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-xl">{blog.author.name}</h3>
                    <p className="text-gray-600">Author</p>
                  </div>
                </div>
              </div>
            </Link>
            <CreateComment onSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
