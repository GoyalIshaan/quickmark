import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllFollowers, useGetUser } from "../hooks/useUser";
import { X } from "lucide-react";

interface FollowerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FollowerModal: React.FC<FollowerModalProps> = ({ isOpen, onClose }) => {
  const { followers: followerIds, loading } = useGetAllFollowers();

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
              <h2 className="text-2xl font-bold">Followers</h2>
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
                  <FollowerItemSkeleton key={index} />
                ))
              ) : followerIds && followerIds.length > 0 ? (
                followerIds.map((followerId) => (
                  <FollowerItem
                    key={followerId.followerId}
                    userId={followerId.followerId}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">
                    You don't have any followers yet.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Keep creating great content!
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

const FollowerItem: React.FC<{ userId: string }> = ({ userId }) => {
  const { user } = useGetUser({ userId });

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
    </motion.div>
  );
};

const FollowerItemSkeleton: React.FC = () => (
  <div className="flex items-center justify-between space-x-4 border border-gray-800 p-4 rounded-lg animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
      <div>
        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export default FollowerModal;
