"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { usePathname } from "next/navigation";

// Define types for products
interface Product {
  id: number;
  name: string;
  price: number;
  orders: number;
  image: string;
  type: string;
  color: string;
}

const ClothesPage = () => {
  const pathname = usePathname();

  // Sample Product Data for filters
  const allProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: 120.23,
    orders: 24,
    image: "/essentials.jpg",
    type: i % 2 === 0 ? "Furniture" : "Decor",
    color: i % 3 === 0 ? "Red" : "Blue",
  }));

  // Replace the sample data with an API call if needed.
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    color: string;
    type: string;
    price: number[];
  }>({
    color: "",
    type: "",
    price: [0, 300],
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Toggle favorite item
  const toggleFavorite = (item: Product) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === item.id);
      return isFavorited
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
    });
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number[]
  ) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  // Apply filters when changed (using sample data for filters)
  useEffect(() => {
    let filtered = allProducts;
    if (filters.color)
      filtered = filtered.filter((p) => p.color === filters.color);
    if (filters.type)
      filtered = filtered.filter((p) => p.type === filters.type);
    if (filters.price.length === 2) {
      filtered = filtered.filter(
        (p) => p.price >= filters.price[0] && p.price <= filters.price[1]
      );
    }
    setProducts(filtered);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="bg-[#EAF5FA] min-h-screen">
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
        
        {/* Center - Links */}
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
        
        {/* Right - Buttons */}
        <div className="flex space-x-2 lg:space-x-4">
          <button
            className="border border-blue-600 text-blue-600 px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-50"
            title="Create Listing"
          >
            Create Listing
          </button>
          <button
            className="bg-blue-600 text-white px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-700"
            title="Sign In"
          >
            Sign In
          </button>
        </div>
      </motion.nav>

      {/* Product Count */}
      <div className="flex justify-between items-center mt-6 px-6">
        <h2 className="text-2xl font-bold text-gray-700">Clothes</h2>
        <p className="text-gray-600">
          Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, products.length)} out of {products.length} Products
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-6">
        {/* Filters */}
        <div className="col-span-1 bg-white p-4 shadow md:w-60 w-full h-min rounded-md flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>

          {/* Filter: Color */}
          <div className="mb-4">
            <h4 className="text-gray-700 font-medium">Color</h4>
            <select
              aria-label="Filter by color"
              className="w-full border text-gray-800 p-2 rounded mt-2 bg-gray-100"
              onChange={(e) => handleFilterChange("color", e.target.value)}
            >
              <option value="">All</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="White">White</option>
              <option value="Green">Green</option>
              <option value="Brown">Brown</option>
              <option value="Purple">Purple</option>
            </select>
          </div>

          {/* Filter: Type */}
          <div className="mb-4">
            <h4 className="text-gray-700 font-medium">Type</h4>
            <select
              aria-label="Filter by type"
              className="w-full border p-2 rounded text-gray-800 mt-2 bg-gray-100"
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All</option>
              <option value="Furniture">Furniture</option>
              <option value="Decor">Decor</option>
              <option value="Appliances">Appliances</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          {/* Filter: Price */}
          <div>
            <h4 className="text-gray-600 font-medium">Price Range</h4>
            <input
              type="range"
              min="0"
              max="300"
              aria-label="Price range"
              className="w-full mt-2"
              onChange={(e) =>
                handleFilterChange("price", [0, Number(e.target.value)])
              }
            />
            <p className="text-gray-500 mt-1">
              ${filters.price[0]} - ${filters.price[1]}
            </p>
          </div>
        </div>

        {/* Listings */}
        <div className="col-span-3 grid grid-cols-1 mb-20 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white border shadow-sm flex flex-col rounded-md overflow-hidden"
              whileHover={{ scale: 1.04 }}
            >
              <div className="relative w-full h-[250px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-60"
                />
                {/* Favorite Heart Button */}
                <motion.button
                  onClick={() => toggleFavorite(product)}
                  aria-label={
                    favorites.some((fav) => fav.id === product.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110"
                  whileTap={{ scale: 0.8 }}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      favorites.some((fav) => fav.id === product.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </motion.button>
              </div>
              <div className="p-4 text-gray-700">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-900 font-bold">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-end">
          <div className="flex space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              aria-label="Previous page"
              className="px-3 py-2 border border-gray-700 rounded disabled:opacity-50 flex items-center"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                aria-label={`Page ${i + 1}`}
                className={`px-3 py-2 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(products.length / itemsPerPage))
                )
              }
              aria-label="Next page"
              className="px-3 py-2 border border-gray-700 rounded disabled:opacity-50 flex items-center"
              disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Favorites Button */}
      <motion.button
        onClick={() => setShowFavorites(!showFavorites)}
        aria-label="Toggle favorites sidebar"
        className="fixed bottom-8 right-12 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-10"
        whileTap={{ scale: 0.9 }}
      >
        {showFavorites ? "Close Favorites" : `Favorites (${favorites.length})`}
      </motion.button>

      {/* Favorites Sidebar */}
      {showFavorites && (
        <motion.div
          className="fixed bottom-20 right-6 bg-white p-4 shadow-lg rounded-lg w-64 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="text-lg text-gray-700 font-bold">Favorites</h3>
            <button
              onClick={() => setShowFavorites(false)}
              aria-label="Close favorites"
            >
              <X className="w-5 h-5 text-gray-700 hover:text-gray-700" />
            </button>
          </div>
          {favorites.length > 0 ? (
            <ul>
              {favorites.map((fav) => (
                <li
                  key={fav.id}
                  className="flex text-gray-700 text-sm justify-between items-center p-2 border-b"
                >
                  <span>{fav.name}</span>
                  <button onClick={() => toggleFavorite(fav)} aria-label="Remove favorite">
                    <X className="w-4 h-4 text-red-500 hover:text-red-900" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-sm">
              No items favorited yet.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ClothesPage;
