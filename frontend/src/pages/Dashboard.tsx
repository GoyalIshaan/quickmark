import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Typing Animation Component
const TypingAnimation = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return <span>{displayedText}</span>;
};

// Main Dashboard Component
const BlogDashboard = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center">
      <motion.div
        className="mb-8 p-8 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-4xl font-bold">
          <TypingAnimation text="Over 10,000 blogs are being written on our platform!" />
        </p>
      </motion.div>
      <motion.a
        href="/blogs"
        className="mt-8 bg-white text-black px-8 py-3 rounded-md text-lg font-bold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Read Blogs
      </motion.a>
    </div>
  );
};

export default BlogDashboard;
