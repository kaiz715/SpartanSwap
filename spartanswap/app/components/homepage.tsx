/**
 * HomePage Component
 * 
 * Renders the landing page of the SpartanSwap application.
 * 
 * Features:
 * - Displays a Navbar at the top for site navigation.
 * - Hero section featuring the site's motto, a "Shop Now" button, and a homepage image.
 * - Highlights section showcasing featured product categories with animated hover effects.
 * - Info/Features section highlighting platform benefits (eco-friendly, student-verified, no shipping fees).
 * 
 * Uses:
 * - Framer Motion for smooth animations and transitions.
 * - Next.js Image and Link components for optimized images and routing.
 * 
 * Responsive Design:
 * - Mobile-first layout that adapts from a stacked column to side-by-side layout on larger screens.
 * 
 * Notes:
 * - Images and category links are statically defined within the component.
 * - Animations are set to play once when the section enters the viewport.
 */

"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative py-12 px-4 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left - Motto & Button */}
        <div className="w-full sm:w-1/2 flex flex-col items-center">
          <Image
            src="/motto.png"
            alt="Shop Friendly, Shop Used, Shop Just What You Need"
            width={500}
            height={500}
            unoptimized
            priority
            className="object-contain"
          />
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
            unoptimized
            priority
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
        <h2 className="text-3xl text-gray-700 font-bold mb-2">HIGHLIGHTS</h2>
        <div className="mx-auto w-20 h-[2.5px] bg-gray-800 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[
            { image: "/furniture.png", title: "FURNITURE", href: "./homegoods" },
            { image: "/clothing.jpg", title: "CLOTHES", href: "./clothes" },
            { image: "/appliances.jpg", title: "APPLIANCES", href: "./homegoods" },
            { image: "/essentials.jpg", title: "ESSENTIALS", href: "./homegoods" },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
            <motion.div
              key={i}
              className="relative group h-[300px] w-full rounded-md overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
                <h3 className="text-white text-xl font-bold uppercase">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          </Link>
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
            <p className="text-gray-700">
              Eco-Friendly &bull; Help Reduce Waste Shopping Used
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">✔</span>
            <p className="text-gray-700">
              Students Are Verified &bull; CWRU Exclusive
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-600 font-bold">🏷</span>
            <p className="text-gray-700">
              On-Campus Pickup &bull; No Shipping Fees
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
