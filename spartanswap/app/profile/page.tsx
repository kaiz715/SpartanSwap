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

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState("/avatar.png");
  const [saveStatus, setSaveStatus] = useState("");
  const [userId, setUserId] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"profile" | "listings">("profile");
  const [myListings, setMyListings] = useState<Product[]>([]);

  const handleProfilePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      try {
        const formData = new FormData();
        formData.append("image", base64);
        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=aaeb2e69efbfbf1b37e059229378b797",
          formData
        );
        const data = response.data as { data: { url: string } };
        setProfilePhoto(data.data.url);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadProfileAndListings = async () => {
    try {
      const resp = await axios.get("http://localhost:5001/api/user", {
        withCredentials: true,
      });
      const data = resp.data as {
        id?: string;
        name?: string;
        gender?: string;
        phoneNumber?: string;
        emailAddresses?: string[];
        profile_picture?: string;
      };
      setUserId(data.id || "");
      setFullName(data.name || "");
      setGender(data.gender || "");
      setPhoneNumber(data.phoneNumber || "");
      setEmailAddresses(data.emailAddresses || []);
      if (data.profile_picture) setProfilePhoto(data.profile_picture);

      if (data.id) {
        const listResp = await axios.get(
          `http://localhost:5001/api/products?sellerId=${data.id}`,
          { withCredentials: true }
        );
        setMyListings(listResp.data as Product[]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadProfileAndListings();
  }, [isLoggedIn]);

  const saveProfile = async () => {
    try {
      const payload = {
        name: fullName,
        gender,
        phoneNumber,
        emails: emailAddresses,
        profilePhoto,
      };
      await axios.put("http://localhost:5001/api/user", payload, {
        withCredentials: true,
      });
      setSaveStatus("Profile saved successfully!");
    } catch (error) {
      console.error(error);
      setSaveStatus("Error saving profile.");
    }
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const signOut = () => {
    removeCookie("jwt_token", { path: "/" });
    window.location.href = "/";
  };

  const deleteListing = async (listingId: number) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/products/${listingId}`,
        { withCredentials: true }
      );
      setMyListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p>You are not logged in.</p>
        <Link href="/">
          <button aria-label="Go back home" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Go Back Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#EAF5FA] min-h-screen p-4 text-gray-700">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4">
          Welcome, {fullName || "User"}
        </h1>

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
            <div className="flex items-center mb-6 space-x-4">
              <label htmlFor="profile-upload" className="cursor-pointer">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={profilePhoto}
                    alt="User Profile Picture"
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
                <p className="font-semibold" aria-label="Email addresses">
                  {emailAddresses.join(", ")}
                </p>
                <p aria-label="Seller ID">Seller ID: {userId}</p>
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
                <label htmlFor="email-address" className="block">
                  Email Addresses
                </label>
                <div id="email-address">
                  {emailAddresses.map((email, idx) => (
                    <p key={idx} className="mt-1">
                      {email}
                    </p>
                  ))}
                </div>
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
                aria-label="Save profile"
                className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded-md text-center"
              >
                Save Profile
              </button>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="w-1/2 bg-red-600 text-white px-4 py-2 rounded-md text-center"
              >
                Sign Out
              </button>
            </div>
            {saveStatus && <p className="mt-2 text-center">{saveStatus}</p>}
          </>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-4" aria-label="My Listings Panel">
            {myListings.length === 0 ? (
              <p>You have no active listings.</p>
            ) : (
              myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded"
                >
                  <Link
                    href={`/product/${listing.id}`}
                    aria-label={`View listing ${listing.name}`}
                    className="flex items-center space-x-4"
                  >
                    <Image
                      src={listing.image}
                      alt={listing.name}
                      width={60}
                      height={60}
                      className="object-cover rounded"
                    />
                    <span className="font-medium">{listing.name}</span>
                  </Link>
                  <div className="space-x-2">
                    <button
                      onClick={() => router.push(`/product/${listing.id}/edit`)}
                      aria-label={`Edit listing ${listing.name}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      aria-label={`Delete listing ${listing.name}`}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
