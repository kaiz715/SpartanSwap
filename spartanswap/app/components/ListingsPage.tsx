/**
 * ListingsPage Component
 * 
 * Displays a dynamic, filterable, and paginated list of products for a given category.
 * 
 * Features:
 * - Fetches product data from a backend API based on the current category.
 * - Supports client-side filtering by color, type, and price range.
 * - Provides pagination for large product lists (9 products per page).
 * - Integrates favorites functionality, allowing users to save and view favorite items.
 * - Includes a floating "Favorites" button and a favorites sidebar for quick access.
 * 
 * Technologies Used:
 * - Framer Motion for smooth animations.
 * - Next.js Image and Link components for optimized routing and asset management.
 * - Lucide-react icons (ChevronLeft, ChevronRight, Heart, X).
 * - FavoritesContext for managing favorited products globally.
 * 
 * Responsive Design:
 * - Adapts grid layout for different screen sizes (1-column on mobile, up to 3-columns on desktop).
 * 
 * Notes:
 * - Filters and listings update automatically when the category or filter options change.
 * - Handles loading states and fetch errors gracefully.
 * 
 * Props:
 * - currentCategory: string — category to filter products initially.
 * 
 * Example Usage:
 * ```tsx
 * <ListingsPage currentCategory="Clothes" />
 * ```
 */

"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/app/components/FavoritesContext";

export interface Product {
    id: number;
    sellerId: number;
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

// Define a color mapping to map color names to hex or CSS color values.
const colorMap: Record<string, string> = {
    Green: "#008000",
    Brown: "#8b4513",
    Gray: "#808080",
    Blue: "#0000FF",
    Red: "#FF0000",
    Black: "#000000",
    White: "#FFFFFF",
    Yellow: "#FFFF00",
    Orange: "#FFA500",
    Purple: "#800080",
    Beige: "#F5F5DC",
    Cream: "#FFFDD0",
    Multi:
        "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
};

interface ListingsPageProps {
    currentCategory: string;
}

export default function ListingsPage({ currentCategory }: ListingsPageProps) {
    const pathname = usePathname();
    const { favorites, toggleFavorite } = useFavorites();

    // Sample products if no data exists.
    /* const sampleProducts: Product[] = [
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
  ]; */

    const [listings, setListings] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showFavorites, setShowFavorites] = useState<boolean>(false);

    const [updated, setUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch products from API when category changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:5001/api/products?category=${encodeURIComponent(
                        currentCategory
                    )}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(
                    `Fetching products for category: ${currentCategory}`
                );
                const data = await response.json();
                console.log("Fetched data:", data);
                setListings(data);

                console.log("Fetched products:", data);
                console.log("listings: ", listings);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentCategory]); // Refetch when category changes

    // Update filters when category changes
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            category: currentCategory,
            type: "", // Reset type filter when category changes
        }));
    }, [currentCategory]);

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

    // Combined effect to load and update listings.
    /* useEffect(() => {
        const updateListings = () => {
            const data = localStorage.getItem("listings");
            if (data && data !== "null" && data !== "undefined") {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setListings(parsed);
                    } else {
                        setListings(sampleProducts);
                        localStorage.setItem(
                            "listings",
                            JSON.stringify(sampleProducts)
                        );
                    }
                } catch (error) {
                    console.error("Error parsing listings", error);
                    setListings(sampleProducts);
                    localStorage.setItem(
                        "listings",
                        JSON.stringify(sampleProducts)
                    );
                }
            } else {
                setListings(sampleProducts);
                localStorage.setItem(
                    "listings",
                    JSON.stringify(sampleProducts)
                );
            }
        };

        updateListings();
        window.addEventListener("listingsUpdated", updateListings);
        return () =>
            window.removeEventListener("listingsUpdated", updateListings);
    }, []); */

    useEffect(() => {
        localStorage.setItem("listings", JSON.stringify(listings));
    }, [listings]);

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
                (p) =>
                    p.price >= filters.price[0] && p.price <= filters.price[1]
            );
        }
        setProducts(filtered);
        setCurrentPage(1);
    }, [filters, listings]);

    const handleFilterChange = (
        key: keyof typeof filters,
        value: string | number[]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="bg-[#EAF5FA] min-h-screen relative">
            {/* Navbar */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>

            {/* Product Count */}
            <div className="flex justify-between items-center mt-6 px-6">
                <h2 className="text-2xl font-bold text-gray-700">
                    {currentCategory}
                </h2>
                <p className="text-gray-600">
                    Showing {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, products.length)} out of{" "}
                    {products.length} Products
                </p>
            </div>

            {/* Listings Grid & Filters */}
            <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-6">
                {/* Filters Column */}
                <div className="col-span-1 self-start bg-white p-4 shadow rounded-md flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Filters
                    </h3>
                    {/* Color Filter */}
                    <div className="mb-4">
                        <h4 className="text-gray-700 font-medium mb-2">
                            Color
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(colorMap).map((colorName) => {
                                const isSelected = filters.color === colorName;

                                return (
                                    <button
                                        key={colorName}
                                        onClick={() =>
                                            handleFilterChange(
                                                "color",
                                                colorName
                                            )
                                        }
                                        className={`
                      flex items-center gap-1 px-2 py-1 border rounded transition-colors
                      ${isSelected ? "border-blue-600" : "border-gray-300"}
                    `}
                                    >
                                        <span
                                            className="inline-block w-6 h-6 rounded-full"
                                            style={{
                                                background: colorMap[colorName],
                                            }}
                                        />
                                        <span className=" text-gray-700 text-sm">
                                            {colorName}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/* Type Filter */}
                    <div>
                        <h4 className="text-gray-700 font-medium mb-2">Type</h4>
                        <div className="flex flex-wrap gap-2">
                            {["All", ...typeOptions[currentCategory]].map(
                                (typeOption) => {
                                    const isSelected =
                                        filters.type === typeOption;
                                    return (
                                        <button
                                            key={typeOption}
                                            onClick={() =>
                                                handleFilterChange(
                                                    "type",
                                                    typeOption === "All"
                                                        ? ""
                                                        : typeOption
                                                )
                                            }
                                            className={`px-3 py-1 border rounded transition-colors text-sm 
                      ${
                          isSelected
                              ? "border-blue-600 bg-blue-100 text-blue-900"
                              : "border-gray-300 text-gray-700"
                      }`}
                                        >
                                            {typeOption}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                    {/* Price Filter */}
                    <div>
                        <label
                            htmlFor="filter-price"
                            className="text-gray-600 font-medium"
                        >
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
                                handleFilterChange("price", [
                                    0,
                                    Number(e.target.value),
                                ])
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
                                        <h3 className="font-semibold">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-900 font-bold">
                                            ${product.price}
                                        </p>
                                    </div>
                                    <motion.button
                                        onClick={(e: { preventDefault: () => void; }) => {
                                            e.preventDefault();
                                            toggleFavorite(product);
                                        }}
                                        aria-label={
                                            favorites.some(
                                                (fav) => fav.id === product.id
                                            )
                                                ? "Remove from favorites"
                                                : "Add to favorites"
                                        }
                                        className="mt-4 self-end bg-white p-2 rounded-full shadow hover:scale-110"
                                        whileTap={{ scale: 0.8 }}
                                    >
                                        <Heart
                                            className={`w-6 h-6 ${
                                                favorites.some(
                                                    (fav) =>
                                                        fav.id === product.id
                                                )
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
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            aria-label="Previous page"
                            className="px-3 py-2 border border-gray-700 rounded disabled:opacity-50 flex items-center"
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        {Array.from({
                            length: Math.ceil(products.length / itemsPerPage),
                        }).map((_, i) => (
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
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        prev + 1,
                                        Math.ceil(
                                            products.length / itemsPerPage
                                        )
                                    )
                                )
                            }
                            aria-label="Next page"
                            className="px-3 py-2 border border-gray-700 rounded disabled:opacity-50 flex items-center"
                            disabled={
                                currentPage ===
                                Math.ceil(products.length / itemsPerPage)
                            }
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
                {showFavorites
                    ? "Close Favorites"
                    : `Favorites (${favorites.length})`}
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
                        <h3 className="text-lg text-gray-700 font-bold">
                            Favorites
                        </h3>
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
                                    <Link
                                        href={`/product/${fav.id}`}
                                        className="flex-1"
                                    >
                                        <span className="cursor-pointer hover:underline">
                                            {fav.name}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => toggleFavorite(fav)}
                                        aria-label="Remove favorite"
                                    >
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
}
