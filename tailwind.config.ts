import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "#E5E7EB",
                background: "#F8F9FA",
                card: "#FFFFFF",
                primary: {
                    DEFAULT: "#7C3AED",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#6B7280",
                    foreground: "#111827",
                },
                accent: {
                    purple: "#7C3AED",
                    green: "#10B981",
                    blue: "#3B82F6",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Sora", "Inter", "sans-serif"],
            },
            borderRadius: {
                lg: "14px",
                xl: "16px",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
};

export default config;
