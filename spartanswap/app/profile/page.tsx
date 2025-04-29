/**
 * ProfilePage Component
 * 
 * Provides users with the ability to view and manage their profile information and their active product listings.
 * 
 * Features:
 * - Loads and displays user profile data (name, gender, phone, email, profile photo).
 * - Allows updating and saving profile details, including uploading a new profile photo.
 * - Supports tabbed navigation between:
 *   - "Profile" view: Edit personal info.
 *   - "Listings" view: View, edit, or delete personal product listings.
 * - Provides functionality to:
 *   - Create a new profile photo.
 *   - Save updated profile data via an API call.
 *   - Sign out (removing JWT cookie and redirecting to home).
 *   - Edit or delete individual listings through modals.
 * 
 * Technologies Used:
 * - React hooks (`useState`, `useEffect`) for local state and lifecycle handling.
 * - Axios for communication with the backend API.
 * - Next.js Link, Image, Router for navigation and media optimization.
 * - react-cookie for managing authentication tokens.
 * 
 * Notes:
 * - Listings are dynamically fetched based on the logged-in user's seller ID.
 * - Authentication is required; otherwise, a "Not Logged In" screen is displayed.
 * - Suppresses hydration warnings to prevent SSR/CSR mismatch issues on reload.
 * - A separate `EditModal` component is used for updating listing details.
 */

// app/profile/page.tsx
"use client";

import { useCookies } from "react-cookie";
import Image from "next/image";
import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../components/Navbar";

interface Product {
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

export default function ProfilePage() {
  const [cookies, , removeCookie] = useCookies(["jwt_token"]);
  const isLoggedIn = Boolean(cookies.jwt_token);
  const router = useRouter();

  // Profile state
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState("/avatar.png");
  const [saveStatus, setSaveStatus] = useState("");
  const [userId, setUserId] = useState<string>("");

  // Tabs & listings
  const [activeTab, setActiveTab] = useState<"profile" | "listings">("profile");
  const [myListings, setMyListings] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Load profile & listings
  const loadProfileAndListings = async () => {
    try {
      const resp = await axios.get("http://localhost:5001/api/user", {
        withCredentials: true,
      });
      const u = resp.data as {
        id: string;
        name: string;
        gender: string;
        phoneNumber: string;
        emailAddresses: string[];
        profile_picture?: string;
      };
      setUserId(u.id);
      setFullName(u.name);
      setGender(u.gender);
      setPhoneNumber(u.phoneNumber);
      setEmailAddresses(u.emailAddresses);
      if (u.profile_picture) setProfilePhoto(u.profile_picture);

      const listResp = await axios.get(
        `http://localhost:5001/api/products?sellerId=${u.id}`,
        { withCredentials: true }
      );
      console.log(listResp.data);
      setMyListings(listResp.data as Product[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadProfileAndListings();
  }, [isLoggedIn]);

  // Handlers
  const handleProfilePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    const r = await axios.post(
      "http://localhost:5001/api/upload-profile-photo",
      fd,
      { withCredentials: true }
    );
    setProfilePhoto(r.data.url);
    saveProfile();
  };

  const saveProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5001/api/user",
        {
          name: fullName,
          gender,
          phoneNumber,
          emails: emailAddresses,
          profile_picture: profilePhoto,
        },
        { withCredentials: true }
      );
      setSaveStatus("Profile saved!");
    } catch {
      setSaveStatus("Error saving profile.");
    }
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const signOut = () => {
    removeCookie("jwt_token", { path: "/" });
    window.location.href = "/";
  };

  const deleteListing = async (id: number) => {
    try {
      await axios.delete("http://localhost:5001/api/delete_listing", {
        data: { product_id: id },
        withCredentials: true,
      });
      console.log(`Deleted listing with ID: ${id}`);
      setMyListings((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };
  

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p>You are not logged in.</p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Go Back Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="bg-[#EAF5FA] min-h-screen p-4 text-gray-700" >
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4">Welcome, {fullName}</h1>

        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 -mb-px ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 -mb-px ${
              activeTab === "listings"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            My Listings
          </button>
        </div>

        {activeTab === "profile" ? (
          <>
            {/* Profile Tab */}
            <div className="flex items-center mb-6 space-x-4">
              <label htmlFor="profile-upload" className="cursor-pointer">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={profilePhoto}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
              </label>
              <div>
                <p className="font-semibold">{emailAddresses.join(", ")}</p>
                <p>Seller ID: {userId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full-name" className="block">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block">
                  Gender
                </label>
                <input
                  id="gender"
                  type="text"
                  placeholder="Enter Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="phone-number" className="block">
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={saveProfile}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Profile
              </button>
              <button
                onClick={signOut}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
            {saveStatus && <p className="mt-2">{saveStatus}</p>}
          </>
        ) : (
          <>
            {/* My Listings Tab */}
            <h2 className="text-2xl mb-4">Your Listings</h2>
            <div className="space-y-4 max-h-96 overflow-auto">
              {myListings.length === 0 ? (
                <p>You have no active listings.</p>
              ) : (
                myListings.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={60}
                        height={60}
                        className="rounded"
                      />
                      <button
                        onClick={() => router.push(`/product/${p.id}`)}
                        className="font-medium text-left"
                      >
                        {p.name}
                      </button>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditProduct(p)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteListing(p.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={() => {
            setEditProduct(null);
            loadProfileAndListings();
          }}
        />
      )}
    </div>
  );
}

function EditModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  onSaved: () => void;
}) {
  const categoryOptions = ["Home Goods", "Clothes", "Tickets", "Rental"] as const;
  type Category = typeof categoryOptions[number];
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

  const [form, setForm] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price,
    category: product.category as Category,
    type: product.type,
    color: product.color,
    image: product.image,
  });

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const fd = new FormData();
    fd.append("image", e.target.files[0]);
    const resp = await axios.post(
      "http://localhost:5001/api/upload-listing-photo",
      fd,
      { withCredentials: true }
    );
    setForm((f) => ({ ...f, image: resp.data.url }));
  };

  const save = async () => {
    console.log("Saving product", form);
    await axios.put(
      `http://localhost:5001/api/products/${product.id}`,
      form,
      { withCredentials: true }
    );
    onSaved();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image */}
        <div className="flex flex-col items-center">
          <Image
            src={form.image}
            alt={form.name}
            width={400}
            height={400}
            className="object-cover rounded-md mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            aria-label="Upload new image"
          />
        </div>
        {/* Right: Fields */}
        <div className="flex flex-col space-y-4">
          <label className="block">
            Title
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full border p-2 rounded mt-1"
            />
          </label>
          <label className="block">
            Description
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border p-2 rounded mt-1"
            />
          </label>
          <label className="block">
            Price
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
              className="w-full border p-2 rounded mt-1"
            />
          </label>
          <label className="block">
            Category
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value as Category,
                  type: "",
                }))
              }
              className="w-full border p-2 rounded mt-1"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Type
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value }))
              }
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select type</option>
              {typeOptions[form.category].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Color
            <select
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              className="w-full border p-2 rounded mt-1"
            >
              {Object.keys(colorMap).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end space-x-2 mt-4 col-span-full">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
