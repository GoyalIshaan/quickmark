import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaLockOpen, FaSave, FaPencilAlt } from "react-icons/fa";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import LabelledInput from "../components/LabelledInput";
import { useGetUser, useUpdateUser } from "../hooks/useUser";
import { useGetBlogsByAuthor } from "../hooks/useBlogs";
import UserBlogCard from "../components/UserBlogCard";
import UserBlogCardSkeleton from "../components/UserBlogCardSkeleton";
import { Link } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const ProfilePage: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const token = localStorage.getItem("token");
  const decoded: { id: string } = token ? jwtDecode(token) : { id: "" };
  const currentUserId = decoded.id as string;
  const { user } = useGetUser({ userId: currentUserId });
  const { updateUser } = useUpdateUser();
  const {
    loading: blogsLoading,
    authorBlogs,
    refetchAuthorBlogs,
  } = useGetBlogsByAuthor();

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

  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: "Loading...",
      email: "Loading...",
      password: "Loading...",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
      });
    }
  }, [user, reset]);

  const watchedFields = watch();

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
  };

  const onSubmit = (data: FormData) => {
    setIsLocked(true);
    console.log("Saving profile:", data);
    updateUser({ userId: currentUserId, ...data });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left side - Input fields */}
          <motion.form
            className="w-full md:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            <LabelledInput
              label="Name"
              placeholder="Enter your name"
              register={register("name") as UseFormRegisterReturn}
              type="text"
              disabled={isLocked}
            />
            <LabelledInput
              label="Email"
              placeholder="Enter your email"
              register={register("email") as UseFormRegisterReturn}
              type="email"
              disabled={isLocked}
            />
            <LabelledInput
              label="Password"
              placeholder="Enter your password"
              register={register("password") as UseFormRegisterReturn}
              type="password"
              disabled={isLocked}
            />
            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={handleToggleLock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 transition-colors duration-300 hover:bg-gray-200"
              >
                {isLocked ? <FaLock /> : <FaLockOpen />}
                {isLocked ? "Unlock" : "Lock"}
              </motion.button>
              {!isLocked && (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 transition-colors duration-300 hover:bg-gray-200"
                  disabled={isLocked}
                >
                  <FaSave />
                  Save
                </motion.button>
              )}
            </div>
          </motion.form>

          {/* Right side - Profile Card */}
          <motion.div
            className="w-full md:w-1/2 hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white text-black p-6 rounded-lg shadow-lg mt-20 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600">Name</label>
                  <p className="text-lg font-semibold">{watchedFields.name}</p>
                </div>
                <div>
                  <label className="block text-gray-600">Email</label>
                  <p className="text-lg font-semibold">{watchedFields.email}</p>
                </div>
                <div className="pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-600">
                    Last updated: {formatDate(user?.updatedAt || "")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Blogs written by user section */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>
          <AnimatePresence mode="wait">
            {blogsLoading ? (
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
            ) : authorBlogs && authorBlogs.length > 0 ? (
              <motion.div
                key="blogs"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {authorBlogs.map((blog) => (
                  <motion.div key={blog.id} variants={itemVariants}>
                    <UserBlogCard
                      id={blog.id}
                      title={blog.title}
                      content={blog.content}
                      createdAt={blog.createdAt}
                      onDelete={refetchAuthorBlogs}
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
                className="text-center py-12 px-4 bg-gray-800 rounded-lg"
              >
                <FaPencilAlt className="mx-auto text-4xl mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
                <p className="text-gray-400 mb-6">
                  Start sharing your thoughts with the world!
                </p>
                <Link
                  to="/create-blog"
                  className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
                >
                  Write Your First Blog
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default ProfilePage;
