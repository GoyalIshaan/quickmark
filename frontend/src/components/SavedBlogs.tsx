import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark } from "react-icons/fa";
import SavedBlogCard from "./SavedBlogCard";
import UserBlogCardSkeleton from "./UserBlogCardSkeleton";
import { Link } from "react-router-dom";

type SavedBlog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type SavedBlogsProps = {
  loading: boolean;
  savedBlogs: SavedBlog[] | null;
  refetchSavedBlogs: () => void;
};

const SavedBlogs: React.FC<SavedBlogsProps> = ({
  loading,
  savedBlogs,
  refetchSavedBlogs,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <UserBlogCardSkeleton key={index} />
            ))}
          </div>
        </motion.div>
      ) : savedBlogs && savedBlogs.length > 0 ? (
        <motion.div
          key="blogs"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10"
        >
          {savedBlogs.map((blog) => (
            <motion.div key={blog.id} variants={itemVariants}>
              <SavedBlogCard
                id={blog.id}
                title={blog.title}
                content={blog.content}
                createdAt={blog.createdAt}
                refetchSavedBlogs={refetchSavedBlogs}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="no-blogs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 px-4 bg-gray-800 rounded-lg my-10"
        >
          <FaBookmark className="mx-auto text-4xl mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No saved blogs</h3>
          <p className="text-gray-400 mb-6">
            Start saving interesting blogs to read later!
          </p>
          <Link
            to="/blogs"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
          >
            Explore Blogs
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SavedBlogs;
