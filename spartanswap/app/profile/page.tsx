"use client";

import { useCookies } from "react-cookie";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [cookies] = useCookies(["jwt_token"]);
  const isLoggedIn = Boolean(cookies.jwt_token);

  // For demonstration, local state for user info
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddresses, setEmailAddresses] = useState<string[]>([
    "alexarawles@gmail.com",
  ]);

  // Example of how you might handle adding a new email
  const [newEmail, setNewEmail] = useState("");
  const handleAddEmail = () => {
    if (newEmail) {
      setEmailAddresses((prev) => [...prev, newEmail]);
      setNewEmail("");
    }
  };

  const loadProfile = async () => {
    axios.get("http://localhost:5001/api/user", { withCredentials: true })
      .then(response => {
        if (response.data.error) {
          console.error("Error fetching profile data:", response.data.error);
        }
        else{
          setFullName(response.data.name);
          setEmailAddresses(emailAddresses.concat(response.data.emails));
        }
        
      })
    }

  useEffect(() => {
    loadProfile();
  }, []);

  // If user isn't logged in, optionally redirect or show a message
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
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
    <div className="bg-[#EAF5FA] min-h-screen p-4">
      <nav className="flex items-center justify-between px-4 h-16 border-b bg-white">
        {/* Example minimal nav on top of profile page */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="SpartanSwap Logo"
            width={80}
            height={80}
            className="object-contain cursor-pointer"
          />
        </Link>
        <div className="flex space-x-2">
          <Link href="/homegoods" className="px-4 py-2 border rounded">
            Home Goods
          </Link>
          <Link href="/clothes" className="px-4 py-2 border rounded">
            Clothes
          </Link>
          <Link href="/rental" className="px-4 py-2 border rounded">
            Rental
          </Link>
          <Link href="/tickets" className="px-4 py-2 border rounded">
            Tickets
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4">Welcome, XXXXX</h1>

        {/* Basic user info section */}
        <div className="flex items-center mb-6 space-x-4">
          {/* User avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image
              src="/avatar.png" // Replace with user's actual photo or from Google
              alt="User Avatar"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Basic info */}
          <div>
            <p className="font-semibold">xxx.xxxx@case.edu</p>
            <p>Seller ID: XXX</p>
          </div>
          <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded">
            Edit
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Your First Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email Address</label>
            {/* List existing email addresses */}
            {emailAddresses.map((email, idx) => (
              <p key={idx} className="mt-1 text-gray-800">
                {email}
              </p>
            ))}
            <div className="flex space-x-2 mt-2">
              <input
                type="email"
                placeholder="Add new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border p-2 rounded flex-grow"
              />
              <button
                onClick={handleAddEmail}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                +Add Email Address
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              placeholder="Your First Name"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              placeholder="Your First Name"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
