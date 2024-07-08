import React, { useState, useEffect } from "react";
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
import { processHtmlContent } from "../components/Rehype";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

const BlogPost: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { loading: blogLoading, blog } = useBlog({ id: id || "" });
  const [refetching, setRefetching] = useState(false);
  const [processedContent, setProcessedContent] = useState<string>("");
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

  useEffect(() => {
    const processContent = async () => {
      if (blog && blog.content) {
        const result = await processHtmlContent(blog.content);
        setProcessedContent(result);
      }
    };

    processContent();
  }, [blog]);

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
    await postComment({ id, title, content });
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    blog.author.name
  )}&background=random&length=1`;

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
          </div>
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: processedContent }}
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
              <div className="bg-gray-50 p-6 rounded-md shadow-md">
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
