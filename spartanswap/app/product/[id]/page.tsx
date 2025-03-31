// app/product/[id]/page.tsx
// This file is a server component (do not use "use client" here).
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Await the params (even if it's not a real promise, this satisfies Next.js)
  const resolvedParams = await Promise.resolve(params);
  return <ProductDetailClient id={resolvedParams.id} />;
}

export async function generateStaticParams() {
  // Provide a few sample IDs for static export.
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}
