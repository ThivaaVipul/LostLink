import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Spinner = () => (
  <div className="flex flex-col justify-center items-center">
    <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-semibold text-gray-600">Loading...</p>
  </div>
);

const FindPage = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [sortByDate, setSortByDate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      axios
        .get("https://lostlinkapi.vercel.app/api/items")
        .then((res) => {
          setItems(res.data);
          setFilteredItems(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching items:", err);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedStartDate && selectedEndDate) {
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);
      filtered = filtered.filter(
        (item) =>
          new Date(item.createdAt) >= startDate && new Date(item.createdAt) <= endDate
      );
    }

    if (sortByDate) {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredItems(filtered);
  }, [searchQuery, items, selectedStartDate, selectedEndDate, sortByDate]);

  const handleDateFilterToggle = () => {
    setIsDateFilterVisible(!isDateFilterVisible);
    if (isDateFilterVisible) {
      setSelectedStartDate("");
      setSelectedEndDate("");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className={isAuthenticated ? "min-h-screen bg-gray-100 py-24" : "min-h-screen bg-gray-100"}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4">
          {!isAuthenticated ? (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Access Denied
                  </h2>
                  <p className="text-gray-700">
                    Please <a href="/login" className="text-blue-600 underline">log in</a> to find an item.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Search Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                  Find Lost & Found Items
                </h1>
              </div>

              {/* Search, Date Filter, and Sort Buttons Row */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                {/* Search Bar */}
                <div className="w-full md:w-4/6 mb-4 md:mb-0 flex items-center">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex space-x-4 mt-4 md:mt-0">
                  {/* Date Filter Button */}
                  <button
                    onClick={handleDateFilterToggle}
                    className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    {isDateFilterVisible ? "Hide Date Filter" : "Show Date Filter"}
                  </button>

                  {/* Sort by Date Button */}
                  <button
                    onClick={() => setSortByDate(!sortByDate)}
                    className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    {sortByDate ? "Sort by Newest" : "Sort by Oldest"}
                  </button>
                </div>
              </div>

              {/* Date Range Picker */}
              {isDateFilterVisible && (
                <div className="mb-6 text-center">
                  <div>
                    <input
                      type="date"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
                      className="px-4 py-2 border rounded-md mr-2"
                    />
                    <span className="mx-2 text-gray-600">to</span>
                    <input
                      type="date"
                      value={selectedEndDate}
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                      className="px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner />
                </div>
              ) : (
                <>
                  {/* Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white p-6 rounded-lg shadow-md transition transform hover:scale-105"
                      >
                        <img
                          src={item.imageURL}
                          alt={item.title}
                          className="w-full h-64 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="text-gray-500 text-sm mb-4">
                          <strong>Created on:</strong> {formatDate(item.createdAt)}
                        </div>
                        <div className="flex justify-between items-center">
                        <span
                          className={`px-3 py-2 text-white font-medium rounded-md ${
                            item.status === "lost" ? "bg-red-600" : "bg-green-600"
                          }`}
                        >
                          {item.status === "lost" ? "Lost Item" : "Found Item"}
                        </span>
                          <button
                            onClick={() => navigate(`/items/${item.uniqueLink}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center">
                      <p className="text-3xl font-bold text-gray-800 mb-4">No items found.</p>
                      <p className="text-lg text-gray-600 mb-6">
                        Try adjusting your search or using different keywords.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-md hover:bg-blue-700 transition duration-300"
                      >
                        Reset Search
                      </button>
                    </div>
                  )}
                </div>

                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FindPage;
