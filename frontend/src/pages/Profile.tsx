import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock,
  FaLockOpen,
  FaSave,
  FaPencilAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import LabelledInput from "../components/LabelledInput";
import { useGetUser, useUpdateUser } from "../hooks/useUser";
import { useGetBlogsByAuthor, useGetSavedBlogs } from "../hooks/useBlogs";
import UserBlogCard from "../components/UserBlogCard";
import UserBlogCardSkeleton from "../components/UserBlogCardSkeleton";
import SavedBlogs from "../components/SavedBlogs";
import { Link, useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const ProfilePage: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [showSavedBlogs, setShowSavedBlogs] = useState(false);
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
  const {
    loading: savedLoading,
    savedBlogs,
    refetchSavedBlogs,
  } = useGetSavedBlogs();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
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
    if (!isLocked) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        password: user?.password || "",
      });
    }
    setIsLocked(!isLocked);
  };

  const onSubmit = (data: FormData) => {
    setIsLocked(true);
    console.log("Saving profile:", data);
    updateUser({ userId: currentUserId, ...data });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-start mt-16 mb-8">
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
            className="w-full md:w-1/2 mt-16 md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md mb-10">
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
                <div className="pt-4 border-t flex justify-between items-center border-gray-300">
                  <p className="text-sm text-gray-600 text-center">
                    Last updated: {formatDate(user?.updatedAt || "")}
                  </p>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-2 transition-colors duration-300 hover:bg-red-600"
                  >
                    <FaSignOutAlt />
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Blogs section */}
        <div className="w-full mt-8">
          <div className="flex justify-center gap-8 mb-4">
            <button
              onClick={() => setShowSavedBlogs(false)}
              className={`text-lg font-semibold ${
                !showSavedBlogs ? "text-white" : "text-gray-400"
              }`}
            >
              Your Blogs
            </button>
            <button
              onClick={() => setShowSavedBlogs(true)}
              className={`text-lg font-semibold ${
                showSavedBlogs ? "text-white" : "text-gray-400"
              }`}
            >
              Saved Blogs
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!showSavedBlogs ? (
              <motion.div
                key="your-blogs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {blogsLoading ? (
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10"
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
                  <div className="text-center py-12 px-4 bg-gray-800 rounded-lg my-10">
                    <FaPencilAlt className="mx-auto text-4xl mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
                    <p className="text-gray-400 mb-6">
                      Start sharing your thoughts with the world!
                    </p>
                    <Link
                      to="/create"
                      className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
                    >
                      Write Your First Blog
                    </Link>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="saved-blogs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SavedBlogs
                  loading={savedLoading}
                  savedBlogs={savedBlogs}
                  refetchSavedBlogs={refetchSavedBlogs}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
