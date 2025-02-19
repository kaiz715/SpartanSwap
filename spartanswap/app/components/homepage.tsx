"use client"; 

import Image from "next/image";
import Link from "next/link"; 
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 h-16 border-b bg-white">
        {/* Left - Centered Logo */}
        <div className="flex items-center relative top-[-4px]">
        <Link href="/"> 
          <Image 
            src="/logo.png" 
            alt="SpartanSwap Logo" 
            width={100} // Adjust size if needed
            height={100}
            priority={true}
            className="object-contain"
          />
          </Link>
        </div>

        {/* Center - Links */}
        <ul className="hidden md:flex flex-grow justify-center space-x-8 lg:space-x-12">
        <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900">Home Goods</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900">Clothes</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900">Rental</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900">Tickets</a></li>
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
      
      <section className="relative py-12 px-4 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        {/* Left - Motto Image and Shop Now Button */}
        <div className="w-full sm:w-1/2 flex flex-col items-center">
        <Image 
          src="/motto.png"
          alt="Shop Friendly, Shop Used, Shop Just What You Need"
          width={500}
          height={500}
          unoptimized={true} 
          priority={true}
          className="object-contain"
        />

          {/* Shop Now Button */}
          <button className="-mt-14 bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition">
            Shop Now
          </button>
        </div>

        {/* Right - Homepage Image */}
        <div className="w-full sm:w-1/2 flex justify-center">
          <Image 
            src="/homepage.png"
            alt="SpartanSwap"
            width={500} 
            height={500}
            unoptimized={true} 
            priority={true} 
            className="object-contain"
          />
        </div>
      </section>


      <section className="py-12 px-4 bg-[#EAF5FA] text-center">
        {/* Title + Underline */}
        <h2 className="text-3xl text-gray-700 font-bold mb-2">HIGHLIGHTS</h2>
        <div className="mx-auto w-20 h-[2.5px] bg-gray-800 mb-8"></div>
        
        {/* 2×2 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Furniture Card */}
          <div className="relative group h-[300px] w-full overflow-hidden">
            <img
              src="/furniture.png"
              alt="Home Goods"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">FURNITURE</h3>
            </div>
          </div>

          {/* Clothes Card */}
          <div className="relative group h-[300px] w-full overflow-hidden">
            <img
              src="/clothing.jpg"
              alt="Clothes"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">CLOTHES</h3>
            </div>
          </div>

          {/* Appliances Card */}
          <div className="relative group h-[300px] w-full overflow-hidden">
            <img
              src="/appliances.jpg"
              alt="Appliances"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">APPLIANCES</h3>
            </div>
          </div>

          {/* Essentials Card */}
          <div className="relative group h-[300px] w-full overflow-hidden">
            <img
              src="/essentials.jpg"
              alt="Essentials"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">ESSENTIALS</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Info Section */}
      <section className="bg-gray-50 py-4">
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
