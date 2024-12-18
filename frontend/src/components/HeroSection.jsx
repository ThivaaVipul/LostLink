import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedToken?.userName || "User");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-[#F4F6F8] flex items-center justify-center px-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 w-full max-w-3xl text-center">
        {/* Conditional Rendering for Logged In and Not Logged In Users */}
        {isLoggedIn ? (
          <>
            {/* Heading for Logged-In User */}
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Hi, <span className="text-blue-500">{username}!</span>
            </h1>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome back to <span className="text-blue-500">LostLink</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">Let's reunite some lost items.</p>
            <div className="flex justify-center gap-6">
              <Link
                to="/post"
                className="w-32 px-4 py-3 border-2 border-blue-600 text-blue-600 font-medium text-lg rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
              >
                Post
              </Link>
              <Link
                to="/find"
                className="w-32 px-4 py-3 bg-blue-600 text-white font-medium text-lg rounded-md hover:bg-blue-700 transition duration-300"
              >
                Find
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Heading for Not Logged-In User */}
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-blue-500">LostLink</span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Join your university's Lost & Found community. Search, report, and reunite with your belongings effortlessly.
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/login"
                className="w-32 px-4 py-3 bg-blue-600 text-white font-medium text-lg rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-32 px-4 py-3 bg-gray-200 text-gray-800 font-medium text-lg rounded-md hover:bg-gray-300 transition duration-300"
              >
                Signup
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
