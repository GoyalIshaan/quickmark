import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LabelledInput from "./LabelledInput";

interface CreateCommentProps {
  onSubmit: (data: CommentFormInputs) => void;
}

interface CommentFormInputs {
  title: string;
  content: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormInputs>();

  const onSubmitHandler: SubmitHandler<CommentFormInputs> = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="w-full mt-8">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Add a Comment</h2>

        <LabelledInput
          label="Title"
          placeholder="Enter the title of your comment"
          register={register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}

        <LabelledInput
          label="Content"
          placeholder="Write your comment here"
          register={register("content", { required: "Content is required" })}
        />
        {errors.content && (
          <p className="text-red-500 text-xs">{errors.content.message}</p>
        )}

        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline hover:bg-gray-800 transition duration-300"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
