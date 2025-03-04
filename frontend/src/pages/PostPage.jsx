import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const PostPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "lost",
    email: "",
    phone: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      }
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Submitting your post...", {
      theme: "light",
    });

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("description", formData.description);
    postData.append("status", formData.status);
    postData.append("email", formData.email);
    postData.append("phone", formData.phone);
    postData.append("postedBy", currentUser.userName);
    postData.append("image", formData.image);
    postData.append("uid", currentUser.userId);


    try {
      await axios.post("https://lostlinkapi.vercel.app/api/items", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.update(toastId, {
        render: "Post created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        transition: Bounce,
      });
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      toast.update(toastId, {
        render: "Failed to create post. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
          {/* Check Authentication */}
          {!isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Access Denied
              </h2>
              <p className="text-gray-700">
                Please <a href="/login" className="text-blue-600 underline">log in</a> to create a post.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Create a Post
              </h2>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Title */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter item title"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter item description"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Image */}
                <div className="mb-4">
                  <label className="block font-medium text-gray-700">Upload Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Create Post"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostPage;
