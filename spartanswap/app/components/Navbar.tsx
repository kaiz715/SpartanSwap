"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCookies } from "react-cookie";

export default function Navbar() {
  const pathname = usePathname();
  const [cookies] = useCookies(["jwt_token"]);
  const isLoggedIn = Boolean(cookies.jwt_token);

  return (
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
            priority={true}
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
        <button className="border border-blue-600 text-blue-600 px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-50">
          Create Listing
        </button>
        {!isLoggedIn ? (
          <button className="bg-blue-600 text-white px-2 py-1 lg:px-4 lg:py-2 rounded text-sm lg:text-base hover:bg-blue-700">
            Sign In
          </button>
        ) : (
          <Link href="/profile">
            <Image
              src="/profileIcon.png" // Replace with your profile icon image
              alt="Profile"
              width={40}
              height={40}
              className="object-contain cursor-pointer rounded-full"
            />
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
