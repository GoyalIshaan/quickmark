import React from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCheckIfUserIsFollowing,
  useFollowUser,
  useGetNumberOfFollowersForUser,
  useGetUser,
  useUnfollowUser,
} from "../hooks/useUser";
import UserBlogCardSkeleton from "../components/UserBlogCardSkeleton";
import { Blog, useGetAllTheBlogsOfAAuthor } from "../hooks/useBlogs";
import AuthorPageSkeleton from "../components/AuthorPageSkeleton";
import SavedBlogCard from "../components/SavedBlogCard";

const AuthorPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { loading, user } = useGetUser({ userId: authorId || " " });
  const { isFollowing, setIsFollowing } = useCheckIfUserIsFollowing(
    authorId || " "
  );
  const authorBlogs = useGetAllTheBlogsOfAAuthor(authorId || " ");

  const { numberOfFollowers: followers, fetchNumberOfFollowers } =
    useGetNumberOfFollowersForUser(authorId || " ");
  const { followUser } = useFollowUser(authorId || " ", fetchNumberOfFollowers);
  const { unfollowUser } = useUnfollowUser(
    authorId || " ",
    fetchNumberOfFollowers
  );
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    console.log(
      `${isFollowing ? "Unfollowed" : "Followed"} author with ID: ${authorId}`
    );
    if (!isFollowing) {
      followUser();
    } else {
      unfollowUser();
    }
  };

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

  if (loading) {
    return <AuthorPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div>Author not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8 mt-16 mb-8">
          {/* Author Details */}
          <motion.div
            className="flex justify-center p-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random&length=1`}
                alt="Author Avatar"
                className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500"
                whileHover={{ scale: 1.05 }}
              />
              <motion.h1
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {user.name}
              </motion.h1>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Followers: {followers}
              </motion.p>
              <motion.button
                onClick={handleFollowToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold border-2  transition-colors duration-300 ${
                  isFollowing
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </motion.button>
            </motion.div>
          </motion.div>
          {/* Author Blogs */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Blogs by {user.name}</h2>
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <UserBlogCardSkeleton key={index} />
                  ))}
                </div>
              ) : authorBlogs && authorBlogs.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {authorBlogs.map((blog: Blog) => (
                    <motion.div key={blog.id} variants={itemVariants}>
                      <SavedBlogCard
                        id={blog.id}
                        title={blog.title}
                        content={blog.content}
                        createdAt={blog.createdAt}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 px-4 bg-gray-800 rounded-lg">
                  <p className="text-xl font-semibold mb-2">No blogs yet</p>
                  <p className="text-gray-400 mb-6">
                    This author hasn't published any blogs yet.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
