import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="homepage-no-scroll"> 
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HomePage;
