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
import FollowersModal from "../components/FollowersModal";
import FollowingModal from "../components/FollowingModal";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const ProfilePage: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [showSavedBlogs, setShowSavedBlogs] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let currentUserId = "";
  try {
    if (token) {
      const decoded: { id: string } = jwtDecode(token);
      currentUserId = decoded.id;
    } else {
      throw new Error("No token found");
    }
  } catch (error) {
    console.error("Invalid token:", error);
    navigate("/signin");
  }

  const { user } = useGetUser({ userId: currentUserId });
  const { updateUser } = useUpdateUser();
  const {
    loading: blogsLoading,
    authorBlogs,
    totalPages,
    currentPage,
    setPage,
    fetchAuthorBlogs: refetchAuthorBlogs,
  } = useGetBlogsByAuthor();
  const {
    loading: savedLoading,
    savedBlogs,
    refetchSavedBlogs,
  } = useGetSavedBlogs();

  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const watchedFields = watch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setIsPageLoading(true);
      await setPage(currentPage - 1);
      setIsPageLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setIsPageLoading(true);
      await setPage(currentPage + 1);
      setIsPageLoading(false);
    }
  };

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

  const onSubmit = async (data: FormData) => {
    setIsLocked(true);
    try {
      await updateUser({
        userId: currentUserId,
        email: data.email,
        name: data.name,
        password: data.password,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleDeleteBlog = async (page: number) => {
    setIsPageLoading(true);
    await refetchAuthorBlogs(page);
    if (authorBlogs.length === 0 && currentPage > 1) {
      await setPage(currentPage - 1);
    } else if (authorBlogs.length === 0) {
      // If it's the first page and no blogs left, just refetch to show the "No blogs" message
      await refetchAuthorBlogs(page);
    }
    setIsPageLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-6xl">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>
        )}
        <div className="flex flex-col md:flex-row gap-8 items-start mt-16 mb-8">
          {/* Profile form */}
          <motion.form
            className="w-full mt-0 md:mt-20 md:w-1/2 space-y-6"
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
                >
                  <FaSave />
                  Save
                </motion.button>
              )}
            </div>
          </motion.form>

          {/* Profile Card */}
          <motion.div
            className="w-full md:w-1/2 mt-16 md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md mb-10">
              <motion.img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || ""
                )}&background=random&length=1`}
                alt="Author Avatar"
                className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500"
                whileHover={{ scale: 1.05 }}
              />
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
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    See Followers
                  </button>
                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className="bg-white text-black border-2 border-black px-4 py-2 rounded"
                  >
                    See Following
                  </button>
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
                {blogsLoading || isPageLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, index) => (
                      <UserBlogCardSkeleton key={index} />
                    ))}
                  </div>
                ) : authorBlogs && authorBlogs.length > 0 ? (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10"
                  >
                    {authorBlogs.map((blog) => (
                      <motion.div key={blog.id}>
                        <UserBlogCard
                          id={blog.id}
                          title={blog.title}
                          content={blog.content}
                          createdAt={blog.createdAt}
                          pageNumber={currentPage}
                          onDelete={handleDeleteBlog}
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
                {authorBlogs && authorBlogs.length > 0 && (
                  <div className="flex justify-between items-center my-10">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || isPageLoading}
                      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                        currentPage === 1
                          ? "bg-black text-white border-2 border-white hover:bg-gray-800 cursor-not-allowed"
                          : "bg-white text-black"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-lg font-medium text-white">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || isPageLoading}
                      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
                        currentPage === totalPages
                          ? "bg-black text-white border-2 border-white hover:bg-gray-800 cursor-not-allowed"
                          : "bg-white text-black "
                      }`}
                    >
                      Next
                    </button>
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

      <AnimatePresence>
        {showFollowersModal && (
          <FollowersModal
            isOpen={showFollowersModal}
            onClose={() => setShowFollowersModal(false)}
          />
        )}
        {showFollowingModal && (
          <FollowingModal
            isOpen={showFollowingModal}
            onClose={() => setShowFollowingModal(false)}
          />
        )}
      </AnimatePresence>
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
