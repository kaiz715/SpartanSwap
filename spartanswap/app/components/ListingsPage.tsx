"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { usePathname } from "next/navigation";

// Define the Product interface.
export interface Product {
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

// Mapping for category-specific type options.
export const typeOptions: Record<string, string[]> = {
  "Home Goods": [
    "Decor",
    "Appliances",
    "Furniture",
    "Lighting",
    "Electronics",
    "Outdoor",
    "Miscellaneous",
  ],
  Clothes: ["Men", "Women", "Kids", "Accessories", "Footwear"],
  Tickets: ["Concert", "Sport", "Theatre", "Festival", "Other"],
  Rental: ["Apartment", "House", "Room", "Office", "Other"],
};

interface ListingsPageProps {
  currentCategory: string;
}

export default function ListingsPage({ currentCategory }: ListingsPageProps) {
  const pathname = usePathname();

  // Sample products (used if no data exists in localStorage)
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: `${currentCategory} Sample Item 1`,
      price: 75,
      orders: 12,
      image: "/essentials.jpg",
      type: typeOptions[currentCategory]?.[0] || "",
      color: "Green",
      category: currentCategory,
      description: `A sample product for ${currentCategory}`,
      isCustom: false,
    },
    {
      id: 2,
      name: `${currentCategory} Sample Item 2`,
      price: 85,
      orders: 8,
      image: "/essentials.jpg",
      type: typeOptions[currentCategory]?.[1] || "",
      color: "Brown",
      category: currentCategory,
      description: `Another sample product for ${currentCategory}`,
      isCustom: false,
    },
  ];

  // Global listings state.
  const [listings, setListings] = useState<Product[]>([]);
  // Filtered products to display.
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  // Filter state for color, type, and price.
  const [filters, setFilters] = useState<{
    category: string;
    color: string;
    type: string;
    price: number[];
  }>({
    category: currentCategory,
    color: "",
    type: "",
    price: [0, 300],
  });

  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Listen for custom listings update events dispatched from Navbar.
  useEffect(() => {
    const updateListings = () => {
      const data = localStorage.getItem("listings");
      console.log("updateListings data:", data);
      if (data && data !== "null" && data !== "undefined") {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setListings(parsed);
          } else {
            // If the array is empty, initialize with sampleProducts.
            setListings(sampleProducts);
            localStorage.setItem("listings", JSON.stringify(sampleProducts));
          }
        } catch (error) {
          console.error("Error parsing listings from localStorage", error);
          setListings(sampleProducts);
          localStorage.setItem("listings", JSON.stringify(sampleProducts));
        }
      } else {
        setListings(sampleProducts);
        localStorage.setItem("listings", JSON.stringify(sampleProducts));
      }
    };
  
    // Run updateListings on mount.
    updateListings();
  
    // Listen for custom "listingsUpdated" events.
    window.addEventListener("listingsUpdated", updateListings);
    return () => {
      window.removeEventListener("listingsUpdated", updateListings);
    };
  }, []);
  

  // Persist listings to localStorage on changes.
  useEffect(() => {
    localStorage.setItem("listings", JSON.stringify(listings));
  }, [listings]);

  // --- FAVORITES ---
  const toggleFavorite = (item: Product) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === item.id);
      return isFavorited ? prev.filter((fav) => fav.id !== item.id) : [...prev, item];
    });
  };

  useEffect(() => {
    const favData = localStorage.getItem("favorites");
    if (favData) {
      setFavorites(JSON.parse(favData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // --- FILTERING ---
  useEffect(() => {
    let filtered = listings;
    if (filters.category && filters.category !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.color) {
      filtered = filtered.filter((p) => p.color === filters.color);
    }
    if (filters.type) {
      filtered = filtered.filter((p) => p.type === filters.type);
    }
    if (filters.price.length === 2) {
      filtered = filtered.filter(
        (p) => p.price >= filters.price[0] && p.price <= filters.price[1]
      );
    }
    setProducts(filtered);
    setCurrentPage(1);
  }, [filters, listings]);
  

  const handleFilterChange = (key: keyof typeof filters, value: string | number[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[#EAF5FA] min-h-screen relative">
      {/* Navbar is rendered at the top; create listing functionality is now centralized in Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Product Count */}
      <div className="flex justify-between items-center mt-6 px-6">
        <h2 className="text-2xl font-bold text-gray-700">{currentCategory}</h2>
        <p className="text-gray-600">
          Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, products.length)} out of{" "}
          {products.length} Products
        </p>
      </div>

      {/* Listings Grid & Filters */}
      <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-6">
        {/* Filters Column */}
        <div className="col-span-1 bg-white p-4 shadow rounded-md flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
          {/* Filter: Color */}
          <div className="mb-4">
            <label htmlFor="filter-color" className="text-gray-700 font-medium">
              Color
            </label>
            <select
              id="filter-color"
              aria-label="Filter by color"
              className="w-full border text-gray-800 p-2 rounded mt-2 bg-gray-100"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleFilterChange("color", e.target.value)
              }
            >
              <option value="">All</option>
              <option value="Green">Green</option>
              <option value="Brown">Brown</option>
              <option value="Gray">Gray</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Yellow">Yellow</option>
              <option value="Orange">Orange</option>
              <option value="Purple">Purple</option>
              <option value="Beige">Beige</option>
              <option value="Cream">Cream</option>
              <option value="Multi-Color">Multi-Color</option>
            </select>
          </div>
          {/* Filter: Type */}
          <div className="mb-4">
            <label htmlFor="filter-type" className="text-gray-700 font-medium">
              Type
            </label>
            <select
              id="filter-type"
              aria-label="Filter by type"
              className="w-full border p-2 rounded text-gray-800 mt-2 bg-gray-100"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleFilterChange("type", e.target.value)
              }
            >
              <option value="">All</option>
              {typeOptions[currentCategory]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* Filter: Price */}
          <div>
            <label htmlFor="filter-price" className="text-gray-600 font-medium">
              Price Range
            </label>
            <input
              type="range"
              id="filter-price"
              min="0"
              max="300"
              aria-label="Price range"
              className="w-full mt-2"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFilterChange("price", [0, Number(e.target.value)])
              }
            />
            <p className="text-gray-500 mt-1">
              ${filters.price[0]} - ${filters.price[1]}
            </p>
          </div>
        </div>

        {/* Listings Column */}
        <div className="col-span-3 grid grid-cols-1 mb-20 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
          {currentProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <motion.div
                className="bg-white border shadow-sm flex flex-col rounded-md overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.04 }}
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-60"
                  />
                )}
                <div className="p-4 text-gray-700 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-900 font-bold">${product.price}</p>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product);
                    }}
                    aria-label={
                      favorites.some((fav) => fav.id === product.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    className="mt-4 self-end bg-white p-2 rounded-full shadow hover:scale-110"
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
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-end">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              aria-label="Previous page"
              className="px-3 py-2 border border-gray-700 rounded disabled:opacity-50 flex items-center"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                aria-label={`Page ${i + 1}`}
                className={`px-3 py-2 border rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))
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
            <button onClick={() => setShowFavorites(false)} aria-label="Close favorites">
              <X className="w-5 h-5 text-gray-700 hover:text-gray-700" />
            </button>
          </div>
          {favorites.length > 0 ? (
            <ul>
              {favorites.map((fav) => (
                <li key={fav.id} className="flex text-gray-700 text-sm justify-between items-center p-2 border-b">
                  <span>{fav.name}</span>
                  <button onClick={() => toggleFavorite(fav)} aria-label="Remove favorite">
                    <X className="w-4 h-4 text-red-500 hover:text-red-900" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-sm">No items favorited yet.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
