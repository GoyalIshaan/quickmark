import React from "react";
import { motion } from "framer-motion";
import SaveButton from "./SaveButton";
import { Link } from "react-router-dom";

interface SavedBlogCardProps {
  title: string;
  content: string;
  createdAt: string;
  id: string;
  refetchSavedBlogs?: () => void;
}

const SavedBlogCard: React.FC<SavedBlogCardProps> = ({
  title,
  content,
  createdAt,
  id,
  refetchSavedBlogs,
}) => {
  const maxCharacters = 150;
  const truncateContent = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };
  const truncatedContent = truncateContent(content, maxCharacters);

  return (
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
      </Link>
      <div className="mt-auto">
        <p className="text-sm text-gray-400 mb-2">
          Created on: {new Date(createdAt).toLocaleDateString()}
        </p>

        <div className="absolute top-2 right-2 text-gray-50">
          <SaveButton
            blogId={id}
            prpage={true}
            onSaveToggle={refetchSavedBlogs}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SavedBlogCard;
