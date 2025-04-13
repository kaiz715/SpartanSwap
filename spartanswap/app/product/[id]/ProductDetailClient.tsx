// app/components/ProductDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useFavorites } from "@/app/components/FavoritesContext";
import axios from "axios";
import Navbar from "@/app/components/Navbar";

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

export default function ProductDetailClient({ id }: { id: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const { favorites, toggleFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchSellerInfo = async (sellerId: number) => {
      try {
        const resp = await axios.get(
          `http://localhost:5001/api/user_search/${sellerId}`,
          { withCredentials: true }
        );
        const u = resp.data;
        setSellerName(u.name);
        setSellerEmail(u.emailAddresses[0]);
        setSellerPhone(u.phoneNumber);
      } catch (e) {
        console.error(e);
      }
    };

    const listings = localStorage.getItem("listings");
    if (listings) {
      const arr: Product[] = JSON.parse(listings);
      const found = arr.find((p) => p.id === Number(id)) || null;
      setProduct(found);
      if (found) fetchSellerInfo(found.sellerId);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Product not found.</p>
        <button
          onClick={() => router.push("/")}
          title="Go back home"
          className="mt-4 text-blue-600 underline"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const isFavorited = favorites.some((f) => f.id === product.id);
  const categoryToUrl: Record<string, string> = {
    "Home Goods": "/homegoods",
    Clothes: "/clothes",
    Tickets: "/tickets",
    Rental: "/rental",
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(sellerEmail);
    alert("Copied!");
  };

  return (
    <div className="bg-[#EAF5FA] min-h-screen relative">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white/50 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row">
          {/* Image */}
          <div className="w-full sm:w-1/2 flex justify-center text-gray-500">
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
                <p>No Image</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full sm:w-1/2 mt-8 sm:mt-0 sm:ml-8 flex flex-col space-y-4">
            {/* Favorite */}
            <div className="flex justify-end">
              <button
                onClick={() => toggleFavorite(product)}
                aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
                title={isFavorited ? "Remove favorite" : "Add favorite"}
                className="text-gray-700 hover:text-red-500"
              >
                <Heart
                  className={`w-7 h-7 ${
                    isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Name & Price */}
            <h1 className="text-2xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-800">
              ${product.price}
            </p>

            {/* Color & Type */}
            <div className="flex space-x-8">
              <div>
                <p className="text-gray-600">Color</p>
                <p className="font-medium text-gray-800">{product.color}</p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-medium text-gray-800">{product.type}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 mb-1">Description</p>
              <p className="text-gray-800">
                {product.description ||
                  "No description provided. Contact seller for details."}
              </p>
            </div>

            {/* Contact Seller */}
            <button
              onClick={() => setShowContactModal(true)}
              title="Contact Seller"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Contact Seller
            </button>

            {/* Back */}
            <button
              onClick={() =>
                router.push(categoryToUrl[product.category] || "/")
              }
              title="Back to listings"
              className="w-full bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Back to Listings
            </button>
          </div>
        </div>
      </div>

      {/* Floating Favorites */}
      <motion.button
        onClick={() => setShowFavorites((v) => !v)}
        aria-label={
          showFavorites ? "Close favorites sidebar" : "Open favorites sidebar"
        }
        title={showFavorites ? "Close favorites" : "Open favorites"}
        className="fixed bottom-8 right-12 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
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
        >
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="font-bold text-gray-700">Favorites</h3>
            <button
              onClick={() => setShowFavorites(false)}
              aria-label="Close favorites sidebar"
              title="Close favorites"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          {favorites.length > 0 ? (
            <ul>
              {favorites.map((f) => (
                <li
                  key={f.id}
                  className="flex justify-between items-center py-1"
                >
                  <span>{f.name}</span>
                  <button
                    onClick={() => toggleFavorite(f)}
                    aria-label={`Remove ${f.name} from favorites`}
                    title="Remove favorite"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-sm">No favorites yet.</p>
          )}
        </motion.div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-gray-700 p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Contact Seller</h2>
            <p>
              <strong>Name:</strong> {sellerName}
            </p>
            <p className="mt-2 flex items-center">
              <strong>Email:</strong>
              <span className="ml-2">{sellerEmail}</span>
              <button
                onClick={copyEmailToClipboard}
                title="Copy email to clipboard"
                className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
              >
                Copy
              </button>
            </p>
            <p className="mt-2">
              <strong>Phone:</strong> {sellerPhone || "Not provided"}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowContactModal(false)}
                title="Close contact modal"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
