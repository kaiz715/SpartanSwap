import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
    /**
     * Enable static exports.
     *
     * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
     */


  /**
   * Set base path. This is the slug of your GitHub repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  //basePath: "/SpartanSwap",

  //assetPrefix: "/SpartanSwap/",
  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },

    env: {
        NEXT_PUBLIC_BASE_PATH: ``, //`/SpartanSwap`,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
};

export default nextConfig;
