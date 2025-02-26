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

const RentalPage = () => {
    const pathname = usePathname();

    // Sample Product Data
    const allProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
        price: 120.23,
        orders: 24,
        image: "/essentials.jpg",
        type: i % 2 === 0 ? "Furniture" : "Decor",
        color: i % 3 === 0 ? "Red" : "Blue",
    }));

    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>(allProducts);
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

    // Apply filters when changed
    useEffect(() => {
        let filtered = allProducts;
        if (filters.color)
            filtered = filtered.filter((p) => p.color === filters.color);
        if (filters.type)
            filtered = filtered.filter((p) => p.type === filters.type);
        if (filters.price.length === 2) {
            filtered = filtered.filter(
                (p) =>
                    p.price >= filters.price[0] && p.price <= filters.price[1]
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

            {/* Product Count */}
            <div className="flex justify-between items-center mt-6 px-6">
                <h2 className="text-2xl font-bold text-gray-700">Rentals</h2>
                <p className="text-gray-600">
                    Showing {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, products.length)} out of{" "}
                    {products.length} Products
                </p>
            </div>

            <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-6">
                {/* Filters */}
                <div className="col-span-1 bg-white p-4 shadow md:w-60 w-full h-min rounded-md flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Filters
                    </h3>

                    {/* Filter: Color */}
                    <div className="mb-4">
                        <h4 className="text-gray-700 font-medium">Color</h4>
                        <select
                            className="w-full border text-gray-800 p-2 rounded mt-2 bg-gray-100"
                            onChange={(e) =>
                                handleFilterChange("color", e.target.value)
                            }
                        >
                            <option value="">All</option>
                            <option value="Red">Red</option>
                            <option value="Blue">Blue</option>
                            <option value="Blue">White</option>
                            <option value="Blue">Green</option>
                            <option value="Blue">Brown</option>
                            <option value="Blue">Purple</option>
                        </select>
                    </div>

                    {/* Filter: Type */}
                    <div className="mb-4">
                        <h4 className="text-gray-700 font-medium">Type</h4>
                        <select
                            className="w-full border p-2 rounded text-gray-800 mt-2 bg-gray-100"
                            onChange={(e) =>
                                handleFilterChange("type", e.target.value)
                            }
                        >
                            <option value="">All</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Decor">Decor</option>
                            <option value="Furniture">Appliances</option>
                            <option value="Decor">Miscellaneous</option>
                        </select>
                    </div>

                    {/* Filter: Price */}
                    <div>
                        <h4 className="text-gray-600 font-medium">
                            Price Range
                        </h4>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            className="w-full mt-2"
                            onChange={(e) =>
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
                                {/* Favorite Heart */}
                                <motion.button
                                    onClick={() => toggleFavorite(product)}
                                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110"
                                    whileTap={{ scale: 0.8 }}
                                >
                                    <Heart
                                        className={`w-6 h-6 ${
                                            favorites.some(
                                                (fav) => fav.id === product.id
                                            )
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-400"
                                        }`}
                                    />
                                </motion.button>
                            </div>
                            <div className="p-4 text-gray-700">
                                <h3 className="font-semibold">
                                    {product.name}
                                </h3>
                                <p className="text-gray-900 font-bold">
                                    ${product.price}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="flex justify-end">
                    <div className="flex space-x-2">
                        {/* Previous Page Button */}
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className="px-3 py-2 border border-gray-700 rounded disabled:opacity-50 flex items-center"
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({
                            length: Math.ceil(products.length / itemsPerPage),
                        }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
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
                                    Math.min(
                                        prev + 1,
                                        Math.ceil(
                                            products.length / itemsPerPage
                                        )
                                    )
                                )
                            }
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

            {/* Floating Favorites Button - position adjusted to be higher */}
            <motion.button
                onClick={() => setShowFavorites(!showFavorites)}
                className="fixed bottom-8 right-12 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-10"
                whileTap={{ scale: 0.9 }}
            >
                {showFavorites
                    ? "Close Favorites"
                    : `Favorites (${favorites.length})`}
            </motion.button>

            {/* Favorites Sidebar - position adjusted */}
            {showFavorites && (
                <motion.div
                    className="fixed bottom-20 right-6 bg-white p-4 shadow-lg rounded-lg w-64 z-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    {/* Sidebar content remains the same */}
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-lg text-gray-700 font-bold">
                            Favorites
                        </h3>
                        <button onClick={() => setShowFavorites(false)}>
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
                                    <button onClick={() => toggleFavorite(fav)}>
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

export default RentalPage;
