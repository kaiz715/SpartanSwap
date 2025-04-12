"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useFavorites } from "@/app/components/FavoritesContext";
import Navbar from "@/app/components/Navbar";
import { useCookies } from "react-cookie";
import axios from "axios";

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

export default function ProductDetailClient({ id: product_id }: { id: string }) {
    const pathname = usePathname();
    const [product, setProduct] = useState<Product | null>(null);
    const [sellerName, setSellerName] = useState("");
    const [sellerEmail, setSellerEmail] = useState("");
    const [sellerPhone, setSellerPhone] = useState("");
    const { favorites, toggleFavorite } = useFavorites();
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const [sellerID, setSellerID] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [cookies] = useCookies(["jwt_token"]);
    const isLoggedIn = Boolean(cookies.jwt_token);

    const [profilePicture, setProfilePicture] = useState("/profileIcon.png");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
    const [id, setId] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5001/api/user",
                    {
                        withCredentials: true,
                    }
                );
                setFullName(response.data.name || "");
                setGender(response.data.gender || "");
                setPhoneNumber(response.data.phoneNumber || "");
                setEmailAddresses(response.data.emailAddresses || []);
                setId(response.data.id || "");
                if (response.data.profile_picture) {
                    setProfilePicture(response.data.profile_picture);
                }
                if (response.data.is_admin) setIsAdmin(true);
            } catch (error) {
                console.error("Failed to load profile picture", error);
            }
        };
        
        if (isLoggedIn) {
            fetchProfile();
        }
        
        const fetchSellerInfo = async (sellerId: number) => {
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/user_search/${sellerId.toString()}`,
                    {
                        withCredentials: true,
                    }
                );
                if (response.data) {
                    setSellerName(response.data.name);
                    setSellerEmail(response.data.emailAddresses[0]);
                    setSellerPhone(response.data.phoneNumber);
                    setSellerID(response.data.id);
                    console.log("Seller info fetched:", response.data);
                }
            } catch (error) {
                console.error("Error fetching seller info:", error);
            }
        };

        const data = localStorage.getItem("listings");
        if (data) {
            const listings: Product[] = JSON.parse(data);
            const found = listings.find((p) => p.id === Number(product_id));
            setProduct(found || null);
            console.log("Product found:", found);
            if (found?.sellerId !== undefined) {
                fetchSellerInfo(found.sellerId);
            }
        }
    }, [product_id]);

    const isFavorited = product
        ? favorites.some((fav) => fav.id === product.id)
        : false;

    const categoryToUrl: Record<string, string> = {
        "Home Goods": "/homegoods",
        Clothes: "/clothes",
        Tickets: "/tickets",
        Rental: "/rental",
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

    const handleDelete = async () => {
        if (!product) return;
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const response = await axios.delete(
                    "http://localhost:5001/api/delete_listing",
                    {
                        data: { product_id: product.id },
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    // Remove from localStorage
                    const data = localStorage.getItem("listings");
                    if (data) {
                        const listings: Product[] = JSON.parse(data);
                        const updatedListings = listings.filter(
                            (p) => p.id !== product.id
                        );
                        localStorage.setItem(
                            "listings",
                            JSON.stringify(updatedListings)
                        );
                    }
                    // Redirect to home or category
                    window.location.href =
                        categoryToUrl[product.category] || "/";
                }
            } catch (error) {
                console.error("Error deleting listing:", error);
                alert("Failed to delete listing. You may not have permission.");
            }
        }
    };

    return (
        <div className="bg-[#EAF5FA] min-h-screen relative">
            {/* Navbar */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>

            {/* Main Product Detail Content */}
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
                        {/* Favorite Icon */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => toggleFavorite(product)}
                                aria-label={
                                    isFavorited
                                        ? "Remove from favorites"
                                        : "Add to favorites"
                                }
                                className="text-gray-700 hover:text-red-500 transition"
                            >
                                <Heart
                                    className={`w-7 h-7 ${
                                        isFavorited
                                            ? "text-red-500 fill-red-500"
                                            : "text-gray-400"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Product Name & Price */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {product.name}
                            </h1>
                            <p className="text-2xl text-gray-800 font-semibold mt-1">
                                ${product.price}
                            </p>
                        </div>

                        {/* Color & Type */}
                        <div className="flex space-x-8">
                            <div>
                                <p className="text-gray-600">Color</p>
                                <p className="font-medium text-gray-800">
                                    {product.color || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Type</p>
                                <p className="font-medium text-gray-800">
                                    {product.type || "N/A"}
                                </p>
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
                            {/* Delete Listings button */}

                            {(isAdmin || sellerID == product_id) && (
                                <div className="mt-4">
                                    {" "}
                                    <button
                                        onClick={handleDelete}
                                        className="w-full bg-red-600 text-white px-3 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                                    >
                                        Delete Listing{" "}
                                    </button>{" "}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Favorites Button */}
            <motion.button
                onClick={() => setShowFavorites((prev) => !prev)}
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
                                    <span>{fav.name}</span>
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
                            No favorites yet.
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    );
}
