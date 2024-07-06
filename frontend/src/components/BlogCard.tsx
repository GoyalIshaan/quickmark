import React from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type BlogCardProps = {
  authorName: string;
  id: string;
  title: string;
  content: string;
  publishedAt: string; // Assuming this is an ISO date string
};

const BlogCard: React.FC<BlogCardProps> = ({
  authorName,
  id,
  title,
  content,
  publishedAt,
}) => {
  const maxCharacters = 150;
  const truncateContent = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };
  const truncatedContent = truncateContent(content, maxCharacters);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(publishedAt);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <Link to={`/blogs/${id}`}>
        <div className="py-6">
          <h2 className="text-3xl font-bold mb-2 text-black hover:text-gray-700 transition-colors duration-300">
            {title}
          </h2>
          <p className="text-gray-800 mb-4">{truncatedContent}</p>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{authorName}</span>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
