import { useState, useEffect, useCallback, useRef } from "react";
import { Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetNumberOfSaves,
  useSaveBlog,
  useSavedByUser,
  useUnsaveBlog,
} from "../hooks/useBlogs";

const SaveButton = ({
  blogId,
  prpage = false,
  onSaveToggle,
}: {
  blogId: string;
  prpage?: boolean;
  onSaveToggle?: () => void; // New prop
}) => {
  const {
    saves,
    refetchSaves,
    loading: savesLoading,
  } = useGetNumberOfSaves(blogId);
  const { saveBlog } = useSaveBlog(blogId);
  const { unsaveBlog } = useUnsaveBlog(blogId);
  const { saved, checkIfSaved, loading: savedLoading } = useSavedByUser(blogId);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoadComplete = useRef(false);
  const [isUnsaving, setIsUnsaving] = useState(false);

  useEffect(() => {
    if (!savesLoading && !savedLoading) {
      initialLoadComplete.current = true;
    }
  }, [savesLoading, savedLoading]);

  const handleSaveToggle = useCallback(async () => {
    setError(null);
    try {
      if (onSaveToggle) {
        setIsUnsaving(true);
        await unsaveBlog();
        onSaveToggle();
        return;
      }
      setAnimating(true);
      if (!saved) {
        await saveBlog();
        setIsUnsaving(false);
      } else {
        setIsUnsaving(true);
        await unsaveBlog();
      }
      await refetchSaves();
      await checkIfSaved();
    } catch (err) {
      setError("Failed to update save status. Please try again.");
    } finally {
      setAnimating(false);
      setTimeout(() => setIsUnsaving(false), 300);
    }
  }, [saved, saveBlog, unsaveBlog, refetchSaves, checkIfSaved, onSaveToggle]);

  if (!initialLoadComplete.current && (savesLoading || savedLoading)) {
    return (
      <div
        className={`flex items-center justify-center space-x-2 w-20 ${
          !prpage ? " bg-gray-100 rounded-full " : ""
        } p-2`}
      >
        <div className={`w-4 h-4 bg-gray-300 rounded-full animate-pulse`}></div>
        <div className={`w-6 h-6 bg-gray-300 rounded-full animate-pulse`}></div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center space-x-2 w-20 ${
        !prpage ? " bg-gray-100 rounded-full " : ""
      } p-2`}
    >
      <motion.span
        key={saves}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold"
      >
        {saves}
      </motion.span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSaveToggle}
        className="relative focus:outline-none"
        aria-label={saved ? "Unsave" : "Save"}
        disabled={animating}
      >
        <motion.div
          animate={{
            scale: animating
              ? isUnsaving
                ? [1, 1.2, 0.9, 1]
                : [1, 1.2, 1]
              : 1,
            rotate: isUnsaving ? [0, 15, -15, 0] : 0,
            transition: { duration: 0.3 },
          }}
        >
          <Bookmark
            className={`w-6 h-6 transition-colors duration-300 ${
              saved ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
        </motion.div>
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 bg-blue-200 rounded-full -z-10"
              style={{ filter: "blur(8px)" }}
            />
          )}
        </AnimatePresence>
      </motion.button>
      <AnimatePresence>
        {animating && !isUnsaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-500 rounded-full"
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

export default SaveButton;
