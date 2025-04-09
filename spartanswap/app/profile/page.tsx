"use client";

import { useCookies } from "react-cookie";
import Image from "next/image";
import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [cookies] = useCookies(["jwt_token"]);
  const isLoggedIn = Boolean(cookies.jwt_token);

  // Local state for user info.
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");

  // Profile photo state. Default to an empty string.
  const [profilePhoto, setProfilePhoto] = useState("/avatar.png");

  // Save status message.
  const [saveStatus, setSaveStatus] = useState("");

  // Handler for uploading a new profile photo.
  const handleProfilePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const photoURL = URL.createObjectURL(file);
    setProfilePhoto(photoURL);
  };

  // Load profile from backend.
  const loadProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/user", {
        withCredentials: true,
      });
      if (response.data.error) {
        console.error("Error fetching profile data:", response.data.error);
      } else {
        console.log("Profile data loaded:", response.data);
        setFullName(response.data.name || "");
        setGender(response.data.gender || "");
        setPhoneNumber(response.data.phoneNumber || "");
        setEmailAddresses(response.data.emailAddresses || []);
        // Set the default Google profile photo if provided.
        if (response.data.profile_picture) {
          setProfilePhoto(response.data.profile_picture);
        }
      }
    } catch (error) {
      console.error("Error loading profile", error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAddEmail = () => {
    if (newEmail) {
      setEmailAddresses((prev) => [...prev, newEmail]);
      setNewEmail("");
    }
  };

  // Save all profile data to the backend.
  const saveProfile = async () => {
    try {
      const payload = {
        name: fullName,
        gender,
        phoneNumber,
        emails: emailAddresses,
        profilePhoto, // This could be a temporary URL or a permanent URL if you've uploaded.
      };
      await axios.put("http://localhost:5001/api/user", payload, { withCredentials: true });
      setSaveStatus("Profile saved successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      setSaveStatus("Error saving profile.");
    }
    setTimeout(() => setSaveStatus(""), 3000);
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
    <div className="bg-[#EAF5FA] min-h-screen p-4 text-gray-700">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4">Welcome, {fullName || "User"}</h1>

        {/* Basic user info section */}
        <div className="flex items-center mb-6 space-x-4">
          {/* Profile photo with clickable upload */}
          <label htmlFor="profile-upload" className="cursor-pointer" aria-label="Upload profile photo">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={profilePhoto}
                alt="User Profile Picture"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              className="hidden"
            />
          </label>
          {/* Basic info */}
          <div>
            <p id="profile-email" className="font-semibold">{emailAddresses}</p>
            <p id="seller-id">Seller ID: XXX</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
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
          {/* Email Addresses */}
          <div>
            <label htmlFor="email-address" className="block">
              Email Address
            </label>
            <div id="email-address">
              {emailAddresses.map((email, idx) => (
                <p key={idx} className="mt-1">
                  {email}
                </p>
              ))}
            </div>
          </div>
          {/* Gender */}
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
              aria-label="Gender"
            />
          </div>
          {/* Phone Number */}
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
              aria-label="Phone Number"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={saveProfile}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
          {saveStatus && <p className="mt-2 text-center">{saveStatus}</p>}
        </div>
      </div>
    </div>
  );
}
