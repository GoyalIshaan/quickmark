/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle, Save, AlertTriangle } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateBlogPost } from "../hooks/useBlogs";
import useBlog from "../hooks/useBlog";
import BlogPostSkeleton from "../components/BlogPostSkeleton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";

window.katex = katex;

interface IFormInput {
  title: string;
}

const EditBlogPost: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { loading: blogLoading, blog } = useBlog({ id: blogId || "" });
  const { updateBlog } = useUpdateBlogPost();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<IFormInput>();
  const titleValue = watch("title");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (blog && !blogLoading) {
      setValue("title", blog.title);
      setContent(blog.content);
    }
  }, [blog, blogLoading, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setErrorMessage(null);
    if (!blogId) return;
    if (!data.title.trim() || !content.trim()) {
      setErrorMessage("Title and content cannot be empty");
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
      ["formula"],
    ],
  };

  if (blogLoading) {
    return <BlogPostSkeleton />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
            Editing
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="relative mb-6 group">
            <div
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out ${
                titleValue
                  ? "opacity-0 -translate-x-4"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <PlusCircle className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
            </div>
            <TextareaAutosize
              {...register("title", { required: "Title is required" })}
              placeholder="Title"
              className={`text-3xl font-bold w-full resize-none overflow-hidden bg-transparent focus:outline-none transition-all duration-300 ease-in-out ${
                titleValue ? "pl-0" : "pl-8"
              } placeholder-gray-400`}
              maxRows={3}
            />
          </div>

          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Tell your story..."
            className="h-[calc(100vh-350px)] mb-6"
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
            <div></div>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full z-10 mt-14 md:mt-8 md:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{isUpdating ? "Updating..." : "Update"}</span>
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center">
            <AlertTriangle className="mr-2 text-red-500" size={20} />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBlogPost;
