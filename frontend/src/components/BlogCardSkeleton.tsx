import React from "react";

const BlogsSkeleton: React.FC = () => {
  const skeletonItems = Array.from({ length: 5 }); // Adjust the number based on how many skeletons you want to display

  return (
    <div className="container mx-auto p-4 space-y-4">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="border-b border-gray-200 last:border-b-0 animate-pulse"
        >
          <div className="py-6">
            <div className="h-8 bg-gray-300 mb-2 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 mb-4 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-5/6"></div>
            <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
              <span className="h-4 bg-gray-300 rounded w-1/4"></span>
              <div className="flex items-center">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogsSkeleton;
