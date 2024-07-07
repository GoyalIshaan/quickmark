import React from "react";
import { FiShare } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ShareButtonProps {
  blogId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ blogId }) => {
  const handleShare = () => {
    const shareLink = `https://quickmark-one.vercel.app/blogs/${blogId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.dismiss();
      toast.success("Link copied to clipboard!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
        title="Share"
      >
        <FiShare size={24} />
      </button>
    </div>
  );
};

export default ShareButton;
