import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";

const EditPage = () => {
  const { uniqueLink } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "lost",
    email: "",
    phone: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    } else {
      setErrorMessage("You need to log in to edit this item.");
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    axios
      .get(`http://localhost:4000/api/items/${uniqueLink}`)
      .then((res) => {
        setItemDetails(res.data);

        // Check if the current user is authorized to edit
        if (res.data.uid !== currentUser.userId) {
          setErrorMessage("You are not authorized to edit this item.");
          return;
        }

        setFormData({
          title: res.data.title,
          description: res.data.description,
          status: res.data.status,
          email: res.data.email,
          phone: res.data.phone,
          image: null,
        });
      })
      .catch((err) => {
        console.error("Error fetching item details:", err);
        setErrorMessage("Failed to load item details. Please try again.");
      });
  }, [uniqueLink, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postData = new FormData();
    postData.append("title", formData.title || itemDetails.title);
    postData.append("description", formData.description || itemDetails.description);
    postData.append("status", formData.status || itemDetails.status);
    postData.append("email", formData.email || itemDetails.email);
    postData.append("phone", formData.phone || itemDetails.phone);

    if (formData.image) {
      postData.append("image", formData.image);
    }

    postData.append("uid", currentUser.userId);

    try {
      await axios.put(
        `http://localhost:4000/api/items/${uniqueLink}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      alert("Post updated successfully!");
      navigate('/');
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (errorMessage) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-700">{errorMessage}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Edit Post</h2>

          {itemDetails ? (
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
                />
              </div>

              {/* Image */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Upload New Image (Optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {itemDetails.imageURL && (
                  <div className="mt-2">
                    <img src={itemDetails.imageURL} alt="Current" className="w-32 h-32 object-cover rounded-md" />
                    <p className="text-gray-500">Current Image</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Post"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center">Loading item details...</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditPage;
