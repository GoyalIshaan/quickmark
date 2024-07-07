import React from "react";
import { motion } from "framer-motion";

const UserBlogCardSkeleton: React.FC = () => {
  return (
    <motion.div
      className="bg-gray-800 p-4 rounded-lg shadow-md relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-pulse">
        <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-2/3 mb-4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/3"></div>
      </div>
      <div className="absolute top-2 right-2 flex space-x-2">
        <div className="w-6 h-6 bg-gray-600 rounded"></div>
        <div className="w-6 h-6 bg-gray-600 rounded"></div>
      </div>
    </motion.div>
  );
};

export default UserBlogCardSkeleton;
