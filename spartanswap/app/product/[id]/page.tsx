/**
 * ProductPage Server Component
 * 
 * Server-side page component for displaying detailed information about a single product.
 * 
 * Features:
 * - Receives the product `id` from URL params.
 * - Passes the product `id` down to the client-side `ProductDetailClient` component for rendering.
 * - Uses `generateStaticParams` to statically pre-render pages for products with IDs 1–6 during build time (SSG).
 * 
 * Technologies Used:
 * - Next.js 13+ Server Components and routing conventions.
 * - Asynchronous data handling using `Promise.resolve` to ensure params are available.
 * 
 * Notes:
 * - This file does not use `"use client"`, meaning it runs entirely on the server side.
 * - `generateStaticParams` improves performance by pre-building pages instead of fetching dynamically at request time.
 */

// This file is a Server Component (no "use client" at the top).

import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Wrap params in a promise to satisfy Next.js's PageProps typing
  const { id } = await Promise.resolve(params);
  return <ProductDetailClient id={id} />;
}

export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}
