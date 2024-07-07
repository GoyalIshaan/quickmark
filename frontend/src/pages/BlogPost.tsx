import React from "react";
import { useParams } from "react-router-dom";
import useBlog from "../hooks/useBlog";
import BlogPostSkeleton from "../components/BlogPostSkeleton";
import { useGetComment, usePostComment } from "../hooks/useComments";
import Comments from "../components/Comment";
import CreateComment from "../components/CreateComment";

const BlogPost: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { loading, blog } = useBlog({ id: id || "" });
  const { comments, loading: commentsLoading } = useGetComment({
    blogId: id || "",
  });
  const { postComment } = usePostComment();

  if (loading) {
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
    postComment({ id, title, content });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-2/3 pr-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="mb-6 text-gray-600">
            Posted on {formatDate(blog.createdAt)}
            <span className="ml-2 cursor-pointer">🔍</span>
          </div>
          <div className="prose max-w-none mb-8">{blog.content}</div>

          <hr className="my-8 border-gray-300" />

          <h2 className="text-3xl font-bold mb-4">Comments</h2>

          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : (
            <Comments comments={comments} />
          )}
        </div>
        <div className="md:w-1/3 mt-8 md:mt-0">
          <div className="sticky top-8">
            <div className="bg-gray-50 p-6 rounded-md">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-bold text-xl">{blog.author.name}</h3>
                  <p className="text-gray-600">Author</p>
                </div>
              </div>
              <p className="text-gray-700">
                Master of mirth, purveyor of puns, and the funniest person in
                the kingdom.
              </p>
            </div>
            <CreateComment onSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
