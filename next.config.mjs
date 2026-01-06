/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Explicitly expose env vars to Edge runtime (required for Amplify)
    env: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    },
    experimental: {
        serverComponentsExternalPackages: ["pdf-parse"],
    },
    // Amplify Web Compute compatibility
    output: 'standalone',
    // Webpack config to stub out 'canvas' (pdfjs-dist optional dep for Node.js)
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;

