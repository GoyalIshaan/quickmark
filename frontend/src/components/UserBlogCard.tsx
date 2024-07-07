import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDeleteBlog } from "../hooks/useBlogs";
import ConfirmModal from "./ConfirmModal";
import { useNavigate } from "react-router-dom";

interface UserBlogCardProps {
  title: string;
  content: string;
  createdAt: string;
  id: string;
  onDelete: () => void;
}

const UserBlogCard: React.FC<UserBlogCardProps> = ({
  title,
  content,
  createdAt,
  id,
  onDelete,
}) => {
  const { deleteBlog } = useDeleteBlog();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    console.log(`Editing blog with id: ${id}`);
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(id);
      onDelete();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg shadow-md relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{content.substring(0, 100)}...</p>
        <p className="text-sm text-gray-400">
          Created on: {new Date(createdAt).toLocaleDateString()}
        </p>
        <div className="absolute top-2 right-2 flex space-x-2">
          <motion.button
            onClick={handleEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white hover:text-blue-300 transition-colors duration-200"
          >
            <FaEdit />
          </motion.button>
          <motion.button
            onClick={() => setIsConfirmOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white hover:text-red-300 transition-colors duration-200"
          >
            <FaTrash />
          </motion.button>
        </div>
      </motion.div>

      {isConfirmOpen && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this blog?"
        />
      )}
    </>
  );
};

export default UserBlogCard;
