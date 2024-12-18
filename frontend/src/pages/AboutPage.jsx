import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-24 lg:py-16">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-screen-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">About LostLink</h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why LostLink Exists</h2>
          <p className="text-gray-600 text-lg mb-6">
            LostLink is a <span className="font-bold">Lost & Found platform</span> designed specifically for university communities. 
            It aims to make the process of reporting, searching, and retrieving lost items quick, easy, 
            and reliable for students, faculty, and staff members.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <ol className="list-decimal list-inside text-gray-600 text-lg mb-6">
            <li className="whitespace-normal"><strong>Report:</strong> When you lose or find an item, create a post with details like title, description, and contact info.</li>
            <li className="whitespace-normal"><strong>Search:</strong> Browse through lost items, or use filters like title or category to find your lost belongings.</li>
            <li className="whitespace-normal"><strong>Reunite:</strong> Connect with the person who found your item and arrange a convenient time to retrieve it.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who Can Use LostLink</h2>
          <p className="text-gray-600 text-lg mb-6">
            LostLink is designed for everyone within a university community—whether you're a student, faculty, or staff member, 
            you can post, search, and reunite with your lost items through this platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 text-lg mb-6">
            Our goal is to make the process of retrieving lost items on university campuses as efficient and reliable as possible. 
            LostLink aims to create a more connected, resourceful, and supportive community for everyone in the university.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
