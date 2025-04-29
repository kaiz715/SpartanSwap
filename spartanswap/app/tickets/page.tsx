/**
 * TicketsPage Component
 * 
 * Displays the ListingsPage filtered to the "Tickets" category.
 * 
 * Features:
 * - Checks for a valid "jwt_token" cookie to determine if the user is authenticated.
 * - On mount, attempts to fetch the user's profile from the backend:
 *   - If the token is invalid or an error occurs, removes the cookie and logs the user out.
 * - If the user is not logged in, displays a prompt to return to the home page.
 * - If authenticated, shows the ListingsPage for ticket listings.
 * 
 * Technologies Used:
 * - react-cookie for managing cookies and authentication.
 * - axios for making HTTP requests to the backend.
 * - Next.js Link component for smooth client-side navigation.
 * 
 * Notes:
 * - `isLoggedIn` is currently a local variable and does not automatically trigger a re-render if cookies change.
 */

"use client";
import ListingsPage from "@/app/components/ListingsPage";
import { useCookies } from "react-cookie";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";

export default function TicketsPage() {
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

    return <ListingsPage currentCategory="Tickets" />;
}
