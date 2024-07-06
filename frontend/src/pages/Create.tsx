import React, { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useNavigate } from "react-router-dom";
import usePostBlog from "../hooks/usePostBlog";

interface IFormInput {
  title: string;
  content: string;
}

const CreateBlogPost: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<IFormInput>();
  const titleValue = watch("title");
  const [content, setContent] = useState("");
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { loading, postBlog, error } = usePostBlog();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const blogID = await postBlog(data.title, content);
      if (blogID) {
        navigate(`/blogs/${blogID}`);
      }
    } catch (err) {
      console.error("Error posting blog:", err);
      // The error is already set in the usePostBlog hook, so we don't need to do anything here
    }
  };

  const handleContentChange = (evt: ContentEditableEvent) => {
    setContent(evt.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
          <div className="pb-16">
            <button
              type="submit"
              className={`bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 text-lg font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPost;
