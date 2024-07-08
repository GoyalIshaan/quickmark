import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDeleteBlog } from "../hooks/useBlogs";
import ConfirmModal from "./ConfirmModal";
import { useNavigate, Link } from "react-router-dom";

interface UserBlogCardProps {
  title: string;
  content: string;
  createdAt: string;
  id: string;
  pageNumber: number;
  onDelete: (page: number) => Promise<void>;
}

const UserBlogCard: React.FC<UserBlogCardProps> = ({
  title,
  content,
  createdAt,
  id,
  pageNumber,
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
      await onDelete(pageNumber);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const maxCharacters = 150;

  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (text: string, limit: number) => {
    const strippedText = stripHtmlTags(text);
    if (strippedText.length <= limit) return strippedText;
    return strippedText.slice(0, limit).trim() + "...";
  };
  const truncatedContent = truncateContent(content, maxCharacters);

  return (
    <>
      <motion.div
        className="bg-gray-800 p-4 rounded-lg shadow-md relative h-full flex flex-col justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/blogs/${id}`} className="flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-300 mb-4 overflow-hidden overflow-ellipsis">
              {truncatedContent}
            </p>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-400 mb-2">
              Created on: {new Date(createdAt).toLocaleDateString()}
            </p>
            <div className="absolute top-2 right-2 flex space-x-2 text-gray-50">
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-blue-300 transition-colors duration-200"
              >
                <FaEdit />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  setIsConfirmOpen(true);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-red-300 transition-colors duration-200"
              >
                <FaTrash />
              </motion.button>
            </div>
          </div>
        </Link>
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
