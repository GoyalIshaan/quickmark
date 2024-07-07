import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Github } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;
      setIsSticky(windowHeight > bodyHeight);
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return (
    <footer
      className={`bg-white border-t border-gray-200 py-8 ${
        isSticky ? "fixed bottom-0 left-0 right-0" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {currentYear} QuickMark Blog. All rights reserved.
            </p>
          </div>
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 hover:text-black transition duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 hover:text-black transition duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 hover:text-black transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/ishaangoyal05"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition duration-300"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://github.com/GoyalIshaan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="https://instagram.com/ishaangoyal05"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition duration-300"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
