import { useState, useEffect, useCallback, useRef } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetNumberOfLikes,
  useLikeBlog,
  useLikedByUser,
  useUnlikeBlog,
} from "../hooks/useBlogs";

const LikeButton = ({ blogId }: { blogId: string }) => {
  const {
    likes,
    refetchLikes,
    loading: likesLoading,
  } = useGetNumberOfLikes(blogId);
  const { likeBlog } = useLikeBlog(blogId);
  const { unlikeBlog } = useUnlikeBlog(blogId);
  const {
    isLiked,
    checkIfLiked,
    loading: likedLoading,
  } = useLikedByUser(blogId);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoadComplete = useRef(false);
  const [isUnliking, setIsUnliking] = useState(false);

  useEffect(() => {
    if (!likesLoading && !likedLoading) {
      initialLoadComplete.current = true;
    }
  }, [likesLoading, likedLoading]);

  const handleLikeToggle = useCallback(async () => {
    setError(null);
    try {
      setAnimating(true);
      if (!isLiked) {
        await likeBlog();
        setIsUnliking(false);
      } else {
        setIsUnliking(true);
        await unlikeBlog();
      }
      await refetchLikes();
      await checkIfLiked();
    } catch (err) {
      setError("Failed to update like status. Please try again.");
    } finally {
      setAnimating(false);
      setTimeout(() => setIsUnliking(false), 300); // Reset isUnliking after animation
    }
  }, [isLiked, likeBlog, unlikeBlog, refetchLikes, checkIfLiked]);

  if (!initialLoadComplete.current && (likesLoading || likedLoading)) {
    return (
      <div className="flex items-center justify-center space-x-2 w-20 bg-gray-100 rounded-full px-2 pb-2">
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 w-20 bg-gray-100 rounded-full p-2">
      <motion.span
        key={likes}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold"
      >
        {likes}
      </motion.span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLikeToggle}
        className="relative focus:outline-none"
        aria-label={isLiked ? "Unlike" : "Like"}
        disabled={animating}
      >
        <motion.div
          animate={{
            scale: animating
              ? isUnliking
                ? [1, 1.2, 0.9, 1]
                : [1, 1.2, 1]
              : 1,
            rotate: isUnliking ? [0, 15, -15, 0] : 0,
            transition: { duration: 0.3 },
          }}
        >
          <Heart
            className={`w-6 h-6 transition-colors duration-300 ${
              isLiked ? "fill-pink-500 text-pink-500" : "text-gray-400"
            }`}
          />
        </motion.div>
        <AnimatePresence>
          {isLiked && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 bg-pink-200 rounded-full -z-10"
              style={{ filter: "blur(8px)" }}
            />
          )}
        </AnimatePresence>
      </motion.button>
      <AnimatePresence>
        {animating && !isUnliking && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-pink-500 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 40 - 20,
                  y: Math.random() * -40 - 20,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-0 w-full text-red-500 text-xs mb-1"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default LikeButton;
