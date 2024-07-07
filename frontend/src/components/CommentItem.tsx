import React, { useState } from "react";
import { Comment, useUpdateComment } from "../hooks/useComments";
import { useGetUser } from "../hooks/userUser";
import { jwtDecode } from "jwt-decode";
import { Calendar, Pencil } from "lucide-react";
import EditCommentModal from "./EditCommentModel";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { user } = useGetUser({ userId: comment.authorId });
  const token = localStorage.getItem("token");
  const decoded: { id: string } = token ? jwtDecode(token) : { id: "" };
  const currentUserId = decoded.id;
  const avatarUrl = `https://robohash.org/${comment.authorId}.png?size=50x50`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateComment } = useUpdateComment();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveComment = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    updateComment({ id: comment.id, title, content });
    console.log("Comment updated");
  };

  return (
    <div className="border-b border-gray-300 py-4 flex items-start space-x-4">
      <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold mt-2">{comment.title}</h4>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500 font-light">
              @{user?.name}
            </span>
            {comment.authorId === currentUserId && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={handleOpenModal}
              >
                <Pencil size={16} className="mb-1" />
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-700 mt-1">{comment.content}</p>
        <div className="flex items-center justify-end text-sm text-gray-500 mt-2">
          <Calendar size={16} className="mr-1" />
          <span>
            Posted on: {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <EditCommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        comment={{ title: comment.title, content: comment.content }}
        onSave={handleSaveComment}
      />
    </div>
  );
};

export default CommentItem;
