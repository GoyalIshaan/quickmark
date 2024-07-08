import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAllFollowing,
  useGetUser,
  useUnfollowUser,
} from "../hooks/useUser";
import { X } from "lucide-react";

interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FollowingModal: React.FC<FollowingModalProps> = ({ isOpen, onClose }) => {
  const {
    following: followingIds,
    fetchFollowing,
    loading,
  } = useGetAllFollowing();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black rounded-xl w-full max-w-md overflow-hidden text-white border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
              <h2 className="text-2xl font-bold">Following</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <FollowingItemSkeleton key={index} />
                ))
              ) : followingIds && followingIds.length > 0 ? (
                followingIds.map((followingId) => (
                  <FollowingItem
                    key={followingId.followingId}
                    userId={followingId.followingId}
                    refetch={fetchFollowing}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">
                    You're not following anyone yet.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Discover new people to follow!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FollowingItem: React.FC<{ userId: string; refetch: () => void }> = ({
  userId,
  refetch,
}) => {
  const { user } = useGetUser({ userId });
  const { unfollowUser } = useUnfollowUser(userId, refetch);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between space-x-4 border border-gray-800 p-4 rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=random&length=1`}
          alt={user.name}
          className="w-12 h-12 rounded-full border-2 border-gray-700"
        />
        <div>
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={unfollowUser}
        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-800 transition-colors duration-300 flex items-center space-x-1"
      >
        <span className="hidden sm:inline">Unfollow</span>
      </motion.button>
    </motion.div>
  );
};

const FollowingItemSkeleton: React.FC = () => (
  <div className="flex items-center justify-between space-x-4 border border-gray-800 p-4 rounded-lg animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
      <div>
        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-32"></div>
      </div>
    </div>
    <div className="w-20 h-8 bg-gray-700 rounded-full"></div>
  </div>
);

export default FollowingModal;
