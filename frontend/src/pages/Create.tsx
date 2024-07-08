/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle, Save, AlertTriangle } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import usePostBlog from "../hooks/usePostBlog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";

window.katex = katex;

interface IFormInput {
  title: string;
}

const CreateBlogPost: React.FC = () => {
  const { register, handleSubmit, watch, setValue } = useForm<IFormInput>();
  const titleValue = watch("title");
  const [content, setContent] = useState("");
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const navigate = useNavigate();
  const { loading, postBlog, error } = usePostBlog();

  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      const { title, content } = JSON.parse(draft);
      if (title || content) {
        setShowDraftPrompt(true);
      }
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
    clearDraft();
    setShowDraftPrompt(false);
  };

  const clearDraft = () => {
    localStorage.removeItem("draft");
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

    const debouncedSaveDraft = debounce(saveDraft, 1000);

    debouncedSaveDraft();

    return () => {
      debouncedSaveDraft.cancel();
    };
  }, [titleValue, content]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const blogID = await postBlog(data.title, content);
      if (blogID) {
        clearDraft();
        navigate(`/blogs/${blogID}`);
      }
    } catch (err) {
      console.error("Error posting blog:", err);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        {showDraftPrompt && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-3 md:mb-0">
                <AlertTriangle className="mr-2 text-yellow-400" size={20} />
                <span className="text-yellow-700">
                  You have an unsaved draft. Would you like to load it?
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={loadDraft}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Load
                </button>
                <button
                  onClick={discardDraft}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg p-4 md:p-6"
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
              className={`text-2xl md:text-3xl font-bold w-full resize-none overflow-hidden bg-transparent focus:outline-none transition-all duration-300 ease-in-out ${
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
              disabled={loading}
              className="w-full z-10 mt-14 md:mt-8 md:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{loading ? "Publishing..." : "Publish"}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center">
            <AlertTriangle className="mr-2 text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Debounce function (same as before)
function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunc = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };

  debouncedFunc.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
  };

  return debouncedFunc;
}

export default CreateBlogPost;
