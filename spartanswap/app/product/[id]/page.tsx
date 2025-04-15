// app/product/[id]/page.tsx
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
/Users/jennyzhang/Documents/GitHub/CaseCycle/spartanswap/app/product/[id]/page.tsx