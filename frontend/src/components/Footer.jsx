import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-gray-700 fixed bottom-0 left-0 z-10">
      <div className="max-w-6xl mx-auto py-4 px-6 flex justify-center items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} LostLink. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
