import React, { useState } from "react";
import {
  Comment,
  useUpdateComment,
  useDeleteComment,
} from "../hooks/useComments";
import { useGetUser } from "../hooks/useUser";
import { jwtDecode } from "jwt-decode";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import EditCommentModal from "../components/EditCommentModel";
import ConfirmModal from "./ConfirmModal";

interface CommentItemProps {
  comment: Comment;
  refetchComments: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  refetchComments,
}) => {
  const { user } = useGetUser({ userId: comment.authorId });
  const token = localStorage.getItem("token");
  const decoded: { id: string } = token ? jwtDecode(token) : { id: "" };
  const currentUserId = decoded.id;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || ""
  )}&background=random&length=1`;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { updateComment } = useUpdateComment(refetchComments);
  const { deleteComment } = useDeleteComment(refetchComments);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveComment = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    await updateComment({ id: comment.id, title, content });
    console.log("Comment updated");
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleDeleteComment = async () => {
    await deleteComment(comment.id);
    console.log("Comment deleted");
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
              <>
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={handleOpenEditModal}
                >
                  <Pencil size={16} className="mb-1" />
                </button>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={handleOpenConfirmModal}
                >
                  <Trash2 size={16} className="mb-1" />
                </button>
              </>
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
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        comment={{ title: comment.title, content: comment.content }}
        onSave={handleSaveComment}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleDeleteComment}
        message="Are you sure you want to delete this comment?"
      />
    </div>
  );
};

export default CommentItem;
