"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import SignInWithGoogle from "@/app/components/signin";
import axios from "axios";

// Define the allowed Category type.
type Category = "Home Goods" | "Clothes" | "Tickets" | "Rental";

// Mapping for URL slugs to category names.
const categoryMapping: Record<string, string> = {
    homegoods: "Home Goods",
    clothes: "Clothes",
    tickets: "Tickets",
    rental: "Rental",
};

export default function Navbar() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1].toLowerCase();
    const defaultCategory: Category = (categoryMapping[
        slug as keyof typeof categoryMapping
    ] || "Home Goods") as Category;

    const [cookies] = useCookies(["jwt_token"]);
    const isLoggedIn = Boolean(cookies.jwt_token);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [profilePicture, setProfilePicture] = useState("/profileIcon.png");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
    const [id, setId] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const [isAdmin, setIsAdmin] = useState(false);

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
    }, [isLoggedIn]);

    const typeOptions: Record<Category, string[]> = {
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

    interface NewListingData {
        photo: File | null;
        photoURL: string;
        title: string;
        description: string;
        price: string;
        type: string;
        category: Category;
        color: string;
    }

    const [newListing, setNewListing] = useState<NewListingData>({
        photo: null,
        photoURL: "",
        title: "",
        description: "",
        price: "",
        type: "",
        category: defaultCategory,
        color: "",
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await axios.post(
                    "http://localhost:5001/api/upload-listing-photo",
                    formData,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                const imageUrl = response.data.url;
                setNewListing((prev) => ({
                    ...prev,
                    photo: file,
                    photoURL: imageUrl,
                }));
            } catch (error) {
                console.error("Error uploading listing photo:", error);
            }
        }
    };

    const handleFormChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        if (name === "category") {
            setNewListing((prev) => ({
                ...prev,
                category: value as Category,
                type: "",
            }));
        } else {
            setNewListing((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddListing = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const product = {
            id: id,
            name: newListing.title,
            price: Number(newListing.price),
            orders: 0,
            image: newListing.photoURL || "/placeholder.jpg",
            type: newListing.type,
            color: newListing.color,
            category: newListing.category,
            description: newListing.description,
            isCustom: true,
            image_url: newListing.photoURL,
        };

        const existingListings = localStorage.getItem("listings");
        const listings = existingListings ? JSON.parse(existingListings) : [];
        listings.push(product);
        localStorage.setItem("listings", JSON.stringify(listings));
        window.dispatchEvent(new Event("listingsUpdated"));

        setNewListing({
            photo: null,
            photoURL: "",
            title: "",
            description: "",
            price: "",
            type: "",
            category: defaultCategory,
            color: "",
        });
        await saveListingToBackend(product);

        setShowCreateModal(false);
        window.location.reload();
    };

    const saveListingToBackend = async (product: any) => {
        try {
            const response = await axios.put(
                "http://localhost:5001/api/add_listing",
                product,
                {
                    withCredentials: true,
                }
            );
            console.log("Listing saved to backend:", response.data);
        } catch (error) {
            console.error("Error saving listing to backend:", error);
        }
    };

    return (
        <>
            <motion.nav
                className="flex items-center justify-between px-4 h-16 border-b bg-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Left - Logo */}
                <div className="flex items-center relative top-[-4px]">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="SpartanSwap Logo"
                            width={100}
                            height={100}
                            priority
                            className="object-contain cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Center - Navigation Links */}
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

                {/* Right - Create Listing & Sign In/Profile Icon */}
                <div className="flex space-x-2 lg:space-x-4">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="border border-blue-600 text-blue-600 px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-50"
                    >
                        Create Listing
                    </button>
                    {!isLoggedIn ? (
                        <button
                            onClick={() => setShowSignInModal(true)}
                            className="bg-blue-600 text-white px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    ) : (
                        <Link href="/profile">
                            <Image
                                src={profilePicture}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="object-cover cursor-pointer rounded-full"
                            />
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* Sign In Modal */}
            {showSignInModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md text-black">
                        <SignInWithGoogle />
                        <button
                            onClick={() => setShowSignInModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-300 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Create Listing Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <motion.div
                        className="bg-white p-6 rounded-md w-full max-w-md text-black"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Create Listing
                        </h2>
                        <form onSubmit={handleAddListing} className="space-y-4">
                            <div>
                                <label htmlFor="photo" className="block mb-1">
                                    Photo Upload
                                </label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full border p-2 rounded"
                                />
                                {newListing.photoURL && (
                                    <Image
                                        src={newListing.photoURL}
                                        alt="Uploaded preview"
                                        width={100}
                                        height={100}
                                        className="mt-2 object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <label htmlFor="title" className="block mb-1">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={newListing.title}
                                    onChange={handleFormChange}
                                    placeholder="Enter title"
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newListing.description}
                                    onChange={handleFormChange}
                                    placeholder="Enter description"
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-1">
                                    Price
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={newListing.price}
                                    onChange={handleFormChange}
                                    placeholder="Enter price"
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block mb-1"
                                >
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={newListing.category}
                                    onChange={handleFormChange}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="Home Goods">
                                        Home Goods
                                    </option>
                                    <option value="Clothes">Clothes</option>
                                    <option value="Tickets">Tickets</option>
                                    <option value="Rental">Rental</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="type" className="block mb-1">
                                    Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={newListing.type}
                                    onChange={handleFormChange}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="">Select type</option>
                                    {(
                                        typeOptions[newListing.category] || []
                                    ).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="color" className="block mb-1">
                                    Color
                                </label>
                                <select
                                    id="color"
                                    name="color"
                                    value={newListing.color}
                                    onChange={handleFormChange}
                                    className="w-full border p-2 rounded"
                                    required
                                >
                                    <option value="">Select color</option>
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
                                    <option value="Multi-Color">
                                        Multi-Color
                                    </option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    );
}
