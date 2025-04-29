/**
 * RentalPage Component
 * 
 * Displays the ListingsPage filtered to the "Rental" category.
 * 
 * Features:
 * - Checks if the user is authenticated by verifying the "jwt_token" cookie.
 * - On mount, attempts to fetch the user's profile from the backend to confirm the session.
 *   - If fetching fails or returns an error, the user is treated as logged out and the token is removed.
 * - If not logged in, displays a prompt to return to the home page.
 * - If logged in, renders the ListingsPage component for rental listings.
 * 
 * Technologies Used:
 * - react-cookie for cookie management and authentication check.
 * - axios for backend API requests.
 * - Next.js Link component for client-side navigation.
 * 
 * Notes:
 * - Uses a local `isLoggedIn` variable, but does not fully leverage React state for reactive updates if the cookie changes dynamically.
 */

"use client";
import ListingsPage from "@/app/components/ListingsPage";
import { useCookies } from "react-cookie";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";

export default function RentalPage() {
    const [cookies, setCookie, removeCookie] = useCookies(["jwt_token"]);
    let isLoggedIn = Boolean(cookies.jwt_token);
    const loadProfile = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/api/user",
                {
                    withCredentials: true,
                }
            );
            if (response.data.error) {
                removeCookie("jwt_token", { path: "/" });
                isLoggedIn = false;
                console.error(
                    "Error fetching profile data:",
                    response.data.error
                );
            } else {
                console.log("Profile data loaded:", response.data);
            }
        } catch (error) {
            removeCookie("jwt_token", { path: "/" });
            isLoggedIn = false;
            console.error("Error loading profile", error);
        }
    };
    useEffect(() => {
        loadProfile();
    }, []);

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
    return <ListingsPage currentCategory="Rental" />;
}
