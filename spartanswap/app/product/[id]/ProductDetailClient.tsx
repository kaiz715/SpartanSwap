"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  orders: number;
  image: string;
  type: string;
  color: string;
  category: string;
  description?: string;
  isCustom?: boolean;
}

export default function ProductDetailClient({ id }: { id: string }) {
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("listings");
    if (data) {
      const listings: Product[] = JSON.parse(data);
      const found = listings.find((p) => p.id === Number(id));
      setProduct(found || null);
    }
    const favData = localStorage.getItem("favorites");
    if (favData) {
      setFavorites(JSON.parse(favData));
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: Product) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === item.id);
      return isFavorited
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
    });
  };

  const isFavorited = product ? favorites.some((fav) => fav.id === product.id) : false;

  // Map product category to its listing URL.
  const categoryToUrl: Record<string, string> = {
    "Home Goods": "/homegoods",
    "Clothes": "/clothes",
    "Tickets": "/tickets",
    "Rental": "/rental",
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Product not found.</p>
        <Link href="/" className="mt-4 text-blue-600 underline">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#EAF5FA] min-h-screen">
      {/* Navbar */}
      <motion.nav
        className="flex items-center justify-between px-4 h-16 border-b bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
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
        <div className="flex space-x-2 lg:space-x-4">
          <button className="border border-blue-600 text-blue-600 px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-50">
            Create Listing
          </button>
          <button className="bg-blue-600 text-white px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-700">
            Sign In
          </button>
        </div>
      </motion.nav>

      {/* Main Content in Transparent White Box */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white/50 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row">
          {/* Left: Product Image */}
          <div className="text-gray-500 w-full sm:w-1/2 flex justify-center">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="object-cover w-full max-h-[500px] rounded-md"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded-md">
                <p className="text-gray-500">No Image</p>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full sm:w-1/2 mt-8 sm:mt-0 sm:ml-8 flex flex-col space-y-4">
            {/* Top Right Favorite Icon */}
            <div className="flex justify-end">
              <button
                onClick={() => toggleFavorite(product)}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className="text-gray-700 hover:text-red-500 transition"
              >
                <Heart
                  className={`w-7 h-7 ${
                    isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Product Name & Price */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-2xl text-gray-800 font-semibold mt-1">${product.price}</p>
            </div>

            {/* Color & Type */}
            <div className="flex space-x-8">
              <div>
                <p className="text-gray-600">Color</p>
                <p className="font-medium text-gray-800">{product.color || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-medium text-gray-800">{product.type || "N/A"}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 mb-1">Description</p>
              <p className="text-gray-800">
                {product.description ||
                  "No description provided. Please contact the seller for more details."}
              </p>
            </div>

            {/* Contact Seller Button */}
            <div>
              <button className="w-full bg-blue-600 text-white px-3 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Contact Seller
              </button>
            </div>

            {/* Back to Listings Button */}
            <div className="mt-4">
              <Link
                href={categoryToUrl[product.category] || "/"}
                className="w-full inline-block bg-gray-300 text-black px-3 py-3 rounded-lg font-semibold hover:bg-gray-400 transition text-center"
              >
                Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
