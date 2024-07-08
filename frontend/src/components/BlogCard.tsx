import React from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ShareButton from "./ShareButton";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";

type BlogCardProps = {
  authorName: string;
  id: string;
  title: string;
  content: string;
  publishedAt: string;
};

const BlogCard: React.FC<BlogCardProps> = ({
  authorName,
  id,
  title,
  content,
  publishedAt,
}) => {
  const maxCharacters = 150;

  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (text: string, limit: number) => {
    const strippedText = stripHtmlTags(text);
    if (strippedText.length <= limit) return strippedText;
    return strippedText.slice(0, limit).trim() + "...";
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
    <div className="border-b border-gray-200 last:border-b-0 overflow-hidden max-w-full">
      <div className="py-6 relative flex flex-col md:flex-row">
        <div className="flex-grow">
          <Link to={`/blogs/${id}`} className="block">
            <h2 className="text-3xl font-bold mb-2 text-black hover:text-gray-700 transition-colors duration-300">
              {title}
            </h2>
            <p className="text-gray-800 mb-4">{truncatedContent}</p>
          </Link>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <span className="font-medium mr-2">@{authorName}</span>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:ml-4 flex items-center space-x-4">
          <LikeButton blogId={id} />
          <SaveButton blogId={id} />
          <ShareButton blogId={id} />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
