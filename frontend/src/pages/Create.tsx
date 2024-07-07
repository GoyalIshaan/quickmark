import React, { useState, useRef, useEffect } from "react";
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
  const { register, handleSubmit, watch, setValue } = useForm<IFormInput>();
  const titleValue = watch("title");
  const [content, setContent] = useState("");
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { loading, postBlog, error } = usePostBlog();

  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      setShowDraftPrompt(true);
    }
  }, []);

  const loadDraft = () => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      const { title, content } = JSON.parse(draft);
      setValue("title", title);
      setContent(content);
    }
    setShowDraftPrompt(false);
  };

  const discardDraft = () => {
    localStorage.removeItem("draft");
    setShowDraftPrompt(false);
  };

  useEffect(() => {
    const saveDraft = () => {
      if (titleValue || content) {
        localStorage.setItem(
          "draft",
          JSON.stringify({ title: titleValue, content })
        );
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      saveDraft();
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveDraft();
    };
  }, [titleValue, content]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const blogID = await postBlog(data.title, content);
      if (blogID) {
        localStorage.removeItem("draft");
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
        {showDraftPrompt && (
          <div className="mb-6 p-8 bg-slate-50 border border-slate-100 rounded-lg text-black">
            <p className="mb-4">
              You have an unsaved draft. Would you like to load it?
            </p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={loadDraft}
                className="bg-white text-black px-4 py-2 rounded"
              >
                Load Draft
              </button>
              <button
                onClick={discardDraft}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Discard Draft
              </button>
            </div>
          </div>
        )}
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
