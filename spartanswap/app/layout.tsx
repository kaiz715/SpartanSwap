/**
 * RootLayout Component
 * 
 * Defines the global structure and shared configuration for the entire SpartanSwap application.
 * 
 * Features:
 * - Applies global fonts (Geist Sans and Geist Mono) across all pages.
 * - Wraps all child components with the FavoritesProvider for global favorites state management.
 * - Includes global CSS styling from "globals.css".
 * - Configures HTML attributes like language and hydration settings.
 * 
 * Metadata:
 * - Title: "SpartanSwap"
 * - Description: "Community reuse app made for the CWRU campus."
 * 
 * Technologies Used:
 * - Next.js layout system for consistent page structure.
 * - next/font/google for loading optimized web fonts.
 * - react context for shared state (favorites).
 * 
 * Notes:
 * - The `suppressHydrationWarning` attribute is used to prevent errors when server and client render content differently.
 */


// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FavoritesProvider } from "@/app/components/FavoritesContext";
import "./styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SpartanSwap",
    description: "Community reuse app made for the CWRU campus.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <FavoritesProvider>{children}</FavoritesProvider>
            </body>
        </html>
    );
}
