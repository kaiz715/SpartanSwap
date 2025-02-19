"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const ClothesPage = () => {
  // Sample Data (Replace with backend data)
  const allProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: 120.23,
    orders: 24,
    image: "/product.jpg", // Replace with actual images
    type: i % 2 === 0 ? "Furniture" : "Decor",
    color: i % 3 === 0 ? "Red" : "Blue",
  }));

  const itemsPerPage = 9; // 3 columns per row
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(allProducts);
  const [filters, setFilters] = useState({ color: "", type: "", price: [0, 300] });

  // Get paginated items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number[]) => {
    setFilters({ ...filters, [key]: value });
  };

  // Apply filters when changed
  useEffect(() => {
    let filtered = allProducts;
    if (filters.color) filtered = filtered.filter((p) => p.color === filters.color);
    if (filters.type) filtered = filtered.filter((p) => p.type === filters.type);
    if (filters.price.length === 2) {
      filtered = filtered.filter((p) => p.price >= filters.price[0] && p.price <= filters.price[1]);
    }
    setProducts(filtered);
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="bg-[#EAF5FA] min-h-screen">
      {/* Header */}
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
          <li><a href="/" className="text-gray-600 hover:text-gray-900">Home</a></li>
          <li><a href="/homegoods" className="text-gray-600 hover:text-gray-900">Home Goods</a></li>
          <li><a href="/clothes" className="text-gray-600 hover:text-gray-900">Clothes</a></li>
          <li><a href="/rental" className="text-gray-600 hover:text-gray-900">Rental</a></li>
          <li><a href="/tickets" className="text-gray-600 hover:text-gray-900">Tickets</a></li>
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

      {/* Product Count */}
      <div className="flex justify-between items-center mt-6 px-6">
        <h2 className="text-2xl font-bold text-gray-700">Clothes</h2>
        <p className="text-gray-600">
          Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, products.length)} out of {products.length} Products
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-6">
        {/* Filters */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>

          {/* Filter: Color */}
          <div className="mb-4">
            <h4 className="text-gray-600 font-medium">Color</h4>
            <select className="w-full border p-2 rounded mt-2 bg-gray-100" onChange={(e) => handleFilterChange("color", e.target.value)}>
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
            <h4 className="text-gray-600 font-medium">Type</h4>
            <select className="w-full border p-2 rounded mt-2 bg-gray-100" onChange={(e) => handleFilterChange("type", e.target.value)}>
              <option value="">All</option>
              <option value="Furniture">Furniture</option>
              <option value="Decor">Decor</option>
              <option value="Furniture">Appliances</option>
              <option value="Decor">Miscellaneous</option>
            </select>
          </div>

          {/* Filter: Price */}
          <div>
            <h4 className="text-gray-600 font-medium">Price Range</h4>
            <input type="range" min="0" max="300" className="w-full mt-2" 
              onChange={(e) => handleFilterChange("price", [0, Number(e.target.value)])} />
            <p className="text-gray-500 mt-1">${filters.price[0]} - ${filters.price[1]}</p>
          </div>
        </div>

        {/* Listings */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="border bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-64 object-cover"/>
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">❤️</button>
              </div>
              <div className="p-4 text-gray-700">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-900 font-bold">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-2 border rounded disabled:opacity-50">←</button>
        {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-2 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-600"}`}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))} className="px-3 py-2 border rounded disabled:opacity-50">→</button>
      </div>
    </div>
  );
};

export default ClothesPage;
