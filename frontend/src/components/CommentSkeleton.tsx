import React from "react";
import { motion } from "framer-motion";

const CommentSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="border-b border-gray-300 py-4 flex items-start space-x-4 animate-pulse"
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentSkeleton;
