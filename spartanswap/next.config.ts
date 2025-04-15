/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: "",
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
