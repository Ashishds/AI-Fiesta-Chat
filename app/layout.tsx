import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Fiesta Chat - Multi-Model AI Chat",
    description: "Chat with multiple AI models simultaneously. Get answers from GPT-4, Groq Llama, and Perplexity in one place.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="antialiased">
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
