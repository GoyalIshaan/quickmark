import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle, AlertCircle } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateBlogPost } from "../hooks/useBlogs";
import useBlog from "../hooks/useBlog";
import BlogPostSkeleton from "../components/BlogPostSkeleton";

interface IFormInput {
  title: string;
  content: string;
}

const EditBlogPost: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { loading: blogLoading, blog } = useBlog({ id: blogId || "" });
  const { updateBlog } = useUpdateBlogPost();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<IFormInput>();
  const titleValue = watch("title");
  const [content, setContent] = useState("");
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blog && !blogLoading) {
      setValue("title", blog.title);
      setContent(blog.content);
    }
  }, [blog, blogLoading, setValue]);

  useEffect(() => {
    if (errorMessage) {
      setFadeOut(false);
    }
  }, [errorMessage]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setErrorMessage(null);
    setFadeOut(false);
    if (!blogId) return;
    if (!data.title.trim()) {
      setErrorMessage("Title cannot be empty");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Content cannot be empty");
      return;
    }
    setIsUpdating(true);
    try {
      await updateBlog(blogId, data.title, content);
      setIsUpdating(false);
      navigate(`/blogs/${blogId}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      setIsUpdating(false);
      setErrorMessage("Failed to update blog. Please try again.");
    }
  };

  const handleContentChange = (evt: ContentEditableEvent) => {
    setContent(evt.target.value);
    if (errorMessage) {
      setFadeOut(true);
      setTimeout(() => {
        setErrorMessage(null);
        setFadeOut(false);
      }, 300); // Duration of the fade-out animation
    }
  };

  if (blogLoading) {
    return <BlogPostSkeleton />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-4 left-4">
        <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
          Editing Blog
        </div>
      </div>
      <div className="flex-grow max-w-3xl mx-auto w-full px-4 py-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center relative h-16">
            <div
              className={`absolute left-0 transition-all duration-300 ease-in-out ${
                titleValue
                  ? "opacity-0 -translate-x-4"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <PlusCircle className="w-8 h-8 text-gray-300" />
            </div>
            <TextareaAutosize
              {...register("title")}
              placeholder="Title"
              className={`text-4xl font-bold focus:outline-none w-full absolute transition-all duration-300 ease-in-out resize-none overflow-hidden ${
                titleValue ? "left-0" : "left-12"
              }`}
              maxRows={2}
            />
          </div>
          <div className="relative">
            <ContentEditable
              innerRef={contentEditableRef}
              html={content}
              onChange={handleContentChange}
              className="w-full min-h-[24rem] text-xl focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
              data-placeholder="Tell your story..."
            />
          </div>
          <div className="pb-16 relative">
            {errorMessage && (
              <div
                className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded transition-opacity duration-300 ${
                  fadeOut ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
            <button
              type="submit"
              className={`bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 text-lg font-medium transform ${
                isUpdating ? "opacity-50 cursor-not-allowed" : "translate-y-0"
              } ${errorMessage ? "mt-4 translate-y-0" : "mt-0 -translate-y-2"}`}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPost;
