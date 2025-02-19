import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-4 border-b">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          {/* Replace with your logo image if needed */}
          <img 
            src="/path/to/spartanswap-logo.png" 
            alt="SpartanSwap Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold">SpartanSwap</span>
        </div>

        {/* Center - Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              Home Goods
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              Clothes
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              Rental
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900"
            >
              Tickets
            </a>
          </li>
        </ul>

        {/* Right - Buttons */}
        <div className="flex space-x-4">
          <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
            Create Listing
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-100 text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Shop Friendly, Shop Used, <br className="hidden sm:block" />
            Shop Just What You Need
          </h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 mt-4">
            Shop Now
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-center mt-10 space-y-4 sm:space-y-0 sm:space-x-6">
            {/* You can replace the logo and text as needed */}
            <img
              src="/path/to/spartanswap-logo.png"
              alt="SpartanSwap"
              className="w-16 h-16 object-contain mx-auto"
            />
            <div className="text-xl font-semibold">
              <p>Shop, Sell, Connect</p>
              <p>Spartan Style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">HIGHLIGHTS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Furniture Card */}
          <div className="relative group">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Furniture"
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">FURNITURE</h3>
            </div>
          </div>

          {/* Clothes Card */}
          <div className="relative group">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Clothes"
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">CLOTHES</h3>
            </div>
          </div>

          {/* Appliances Card */}
          <div className="relative group">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Appliances"
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">APPLIANCES</h3>
            </div>
          </div>

          {/* Essentials Card */}
          <div className="relative group">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Essentials"
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">ESSENTIALS</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Info Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            {/* Replace with an appropriate icon if desired */}
            <span className="text-green-600 font-bold">♻</span>
            <p className="text-gray-700">
              Eco-Friendly &bull; Help Reduce Waste Shopping Used
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Replace with an appropriate icon if desired */}
            <span className="text-blue-600 font-bold">✔</span>
            <p className="text-gray-700">
              Students Are Verified &bull; CWRU Exclusive
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Replace with an appropriate icon if desired */}
            <span className="text-red-600 font-bold">🏷</span>
            <p className="text-gray-700">
              On-Campus Pickup &bull; No Shipping Fees
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
