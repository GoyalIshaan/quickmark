import { Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white w-full border-b">
      <div className="container py-2">
        <div className="flex justify-between w-screen px-8 items-center">
          <div className="text-2xl font-bold text-black justify-start">
            <Link to="/">QuickMark</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/blogs"
              className="px-4 py-2 text-black hover:text-gray-800 transition duration-300"
            >
              Blogs
            </Link>
            <div className="h-6 border-l border-black"></div>
            <Link
              to="/create"
              className="px-4 py-2 text-black hover:text-gray-800 transition duration-300"
            >
              Create
            </Link>
            <div className="h-6 border-l border-black"></div>
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="px-4 py-2 text-black hover:text-gray-800 transition duration-300"
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 text-black hover:text-gray-800 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-2 md:hidden">
            <Link
              to="/blogs"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Blogs
            </Link>
            <Link
              to="/create"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Create
            </Link>
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/signin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
