"use client";
import HomePage from "./components/homepage";

export default function Page() {
    return <HomePage />;
}

// page.tsx
// use CSR
/* import { useEffect, useState } from "react";

export default function Page() {
    const [isServer, setIsClient] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isServer) return null;

    return <HomePage />;
} */
