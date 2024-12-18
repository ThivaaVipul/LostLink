import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("authToken");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Invalid token format");
        const decodedToken = JSON.parse(atob(parts[1]));
        setUsername(decodedToken?.userName || "User");
      } catch (err) {
        console.error("Invalid token:", err.message);
        localStorage.removeItem("authToken");
        setUsername("");
      }
    }
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-md fixed top-0 left-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          LostLink
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="text-gray-700 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/post"
            className="text-gray-700 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300"
          >
            Post
          </Link>
          <Link
            to="/find"
            className="text-gray-700 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300"
          >
            Find
          </Link>
          <Link
            to="/about"
            className="text-gray-700 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300"
          >
            About
          </Link>
          {/* Dropdown for Logged-in User */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <span className="mr-2 font-semibold">{username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-gray-100 p-2 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <Link
            to="/"
            className="block text-gray-700 py-2 px-4 hover:bg-blue-100 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/post"
            className="block text-gray-700 py-2 px-4 hover:bg-blue-100 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Post
          </Link>
          <Link
            to="/find"
            className="block text-gray-700 py-2 px-4 hover:bg-blue-100 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Find
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 py-2 px-4 hover:bg-blue-100 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {/* Mobile Logout Button for Logged-in User */}
          {isLoggedIn && (
            <div className="border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-600 py-2 px-4 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
