import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { X } from "lucide-react";
import LabelledInput from "./LabelledInput";

interface EditCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: { title: string; content: string };
  onSave: (updatedComment: { title: string; content: string }) => void;
}

type FormValues = {
  title: string;
  content: string;
};

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  isOpen,
  onClose,
  comment,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: comment.title,
      content: comment.content,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 md:mx-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Comment</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <LabelledInput
            label="Title"
            placeholder="Title"
            register={register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
          <LabelledInput
            label="Content"
            placeholder="Content"
            register={register("content", { required: "Content is required" })}
            type="textarea"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-950"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCommentModal;
