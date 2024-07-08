import React from "react";

const AuthorPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="flex flex-col md:flex-row items-start gap-8 mt-16 mb-8">
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-40 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPageSkeleton;
