"use client"; 

import Image from "next/image";
import Link from "next/link"; 
import React from 'react';
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";


const HomePage = () => {
  const pathname = usePathname(); 
  return (
    <div className="bg-white">
      {/* Navbar */}
      <motion.nav
  className="flex items-center justify-between px-4 h-16 border-b bg-white"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Left - Logo (Clickable) */}
  <div className="flex items-center relative top-[-4px]">
    <Link href="/">
      <Image
        src="/logo.png"
        alt="SpartanSwap Logo"
        width={100}
        height={100}
        priority={true}
        className="object-contain cursor-pointer"
      />
    </Link>
  </div>
  
  {/* Center - Links with improved responsive behavior */}
  <ul className="hidden md:flex flex-grow justify-center">
    {[
      { name: "Home", href: "/" },
      { name: "Home Goods", href: "/homegoods" },
      { name: "Clothes", href: "/clothes" },
      { name: "Rental", href: "/rental" },
      { name: "Tickets", href: "/tickets" },
    ].map((tab) => (
      <li key={tab.href}>
        <Link
          href={tab.href}
          className={`whitespace-nowrap text-sm lg:text-base transition-all mx-1 lg:mx-3 ${
            pathname === tab.href
            ? "bg-blue-100 text-blue-900 font-bold px-2 py-2 lg:px-4 rounded-md"
            : "text-gray-600 hover:text-gray-900 px-2 py-2 lg:px-4"
          }`}
        >
          {tab.name}
        </Link>
      </li>
    ))}
  </ul>
  
  {/* Right - Buttons with responsive adjustments */}
  <div className="flex space-x-2 lg:space-x-4">
    <button className="border border-blue-600 text-blue-600 px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-50">
      Create Listing
    </button>
    <button className="bg-blue-600 text-white px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-700">
      Sign In
    </button>
  </div>
</motion.nav>
      
      {/* Hero Section (Fades in & Slides Up) */}
      <motion.section
        className="relative py-12 px-4 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left - Motto Image and Button */}
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

          {/* Shop Now Button (Hover Animation) */}
          <Link href="/homegoods">
            <motion.button
              className="mt-2 bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1.2 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
            >
              Shop Now
            </motion.button>
          </Link>
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
      </motion.section>


      {/* Highlights Section */}
      <motion.section
        className="py-12 px-4 bg-[#EAF5FA] text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Title + Underline */}
        <h2 className="text-3xl text-gray-700 font-bold mb-2">HIGHLIGHTS</h2>
        <div className="mx-auto w-20 h-[2.5px] bg-gray-800 mb-8"></div>

        {/* 2×2 Grid Layout (Each Card Scales on Hover) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[
            { image: "/furniture.png", title: "FURNITURE" },
            { image: "/clothing.jpg", title: "CLOTHES" },
            { image: "/appliances.jpg", title: "APPLIANCES" },
            { image: "/essentials.jpg", title: "ESSENTIALS" }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="relative group h-[300px] w-full rounded-md overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut"}}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.08, 
                transition: { duration: 0.2, ease: "easeInOut" }, 
              }}
            >
            
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={400}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <h3 className="text-white text-xl font-bold uppercase">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features / Info Section */}
      <motion.section
        className="bg-gray-50 py-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-bold">♻</span>
            <p className="text-gray-700">Eco-Friendly &bull; Help Reduce Waste Shopping Used</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">✔</span>
            <p className="text-gray-700">Students Are Verified &bull; CWRU Exclusive</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-600 font-bold">🏷</span>
            <p className="text-gray-700">On-Campus Pickup &bull; No Shipping Fees</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
