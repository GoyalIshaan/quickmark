import React from "react";

const BlogPostSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse min-h-screen">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-2/3 pr-8">
          <div className="h-10 bg-gray-300 rounded mb-4 w-3/4"></div>
          <div className="mb-6 text-gray-600 h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="prose max-w-none mb-8">
            <div className="h-6 bg-gray-300 rounded mb-2 w-full"></div>
            <div className="h-6 bg-gray-300 rounded mb-2 w-5/6"></div>
            <div className="h-6 bg-gray-300 rounded mb-2 w-2/3"></div>
            <div className="h-6 bg-gray-300 rounded mb-2 w-full"></div>
            <div className="h-6 bg-gray-300 rounded mb-2 w-5/6"></div>
          </div>
        </div>
        <div className="md:w-1/3 mt-8 md:mt-0">
          <div className="sticky top-8">
            <div className="bg-gray-50 p-6 rounded-md">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;
