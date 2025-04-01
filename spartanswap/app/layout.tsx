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
        <html lang="en">
            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <FavoritesProvider>{children}</FavoritesProvider>
            </body>
        </html>
    );
}
