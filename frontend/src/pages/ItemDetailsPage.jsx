import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faWhatsapp,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faLink, faPhoneAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Spinner = () => (
  <div className="flex flex-col justify-center items-center h-screen">
    <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-semibold text-gray-600">Loading...</p>
  </div>
);

const ItemDetailsPage = () => {
  const { uniqueLink } = useParams();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`https://lostlinkapi.vercel.app/api/items/${uniqueLink}`)
      .then((res) => {
        setItemDetails(res.data);
      })
      .catch((err) => {
        console.error("Error fetching item details:", err);
      });
  }, [uniqueLink]);

  if (!itemDetails) {
    return <Spinner />;
  }

  const { title, description, status, email, phone, imageURL, createdAt, postedBy, uid } = itemDetails;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shareText =
    status === "lost"
      ? `Help me find this lost item: ${title}`
      : `This item has been found: ${title}`;
  const shareUrl = encodeURIComponent(window.location.href);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
  
    try {
      await axios.delete(`https://lostlinkapi.vercel.app/api/items/${uniqueLink}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item and image deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item.");
    }
  };
  
  const handleEdit = () => {
    navigate(`/edit/${uniqueLink}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-24">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">

          {currentUser && (
            <div className="flex justify-end mb-4">
              {/* Show Edit button only if current user created the post */}
              {currentUser.userId === uid && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Edit
                </button>
              )}

              {/* Show Delete button if current user created the post OR if the user is an admin */}
              {(currentUser.userId === uid || currentUser.role === "admin") && (
                <button
                  onClick={handleDelete}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">{title}</h2>

          {/* Image and Description */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-2xl">
              <img
                src={imageURL || "https://via.placeholder.com/500"}
                alt={title}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
              <p className="text-lg text-gray-700 mt-6">{description}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-6">
            <span
              className={`px-6 py-2 text-white font-medium rounded-md ${
                status === "lost" ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {status === "lost" ? "Lost Item" : "Found Item"}
            </span>
          </div>

          {/* Posted By */}
          <div className="text-center mb-6 text-gray-500 text-lg">
            <strong>Posted by:</strong> {postedBy}
          </div>

          {/* Date */}
          <div className="text-center mb-6 text-gray-500 text-sm">
            <strong>Created on:</strong> {formatDate(createdAt)}
          </div>

          {/* Contact Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              Contact the Owner
            </h3>
            <div className="flex justify-center gap-6">
              {/* Call Button */}
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center w-40 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                Call
              </a>

              {/* Mail Button */}
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center w-40 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Email
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center w-40 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              >
                <FontAwesomeIcon icon={faLink} className="mr-2" />
                Copy Link
              </button>
            </div>
            {isLinkCopied && (
              <p className="text-center text-sm text-green-600 mt-2">
                Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Share Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              Help Spread the Word
            </h3>
            <div className="flex justify-center gap-8">
              {/* WhatsApp */}
              <div className="flex flex-col items-center">
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <span className="text-sm text-gray-600 mt-2">WhatsApp</span>
              </div>

              {/* Facebook */}
              <div className="flex flex-col items-center">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-300"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <span className="text-sm text-gray-600 mt-2">Facebook</span>
              </div>

              {/* Instagram */}
              <div className="flex flex-col items-center">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <span className="text-sm text-gray-600 mt-2">Instagram</span>
              </div>

              {/* X */}
              <div className="flex flex-col items-center">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
                >
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <span className="text-sm text-gray-600 mt-2">X</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetailsPage;