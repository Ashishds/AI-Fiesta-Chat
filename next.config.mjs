/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Explicitly expose env vars to Edge runtime (required for Amplify)
    env: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    // Amplify Web Compute compatibility
    output: 'standalone',
};

export default nextConfig;
