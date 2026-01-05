import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://ashishgenai.online"),
    title: {
        default: "AI Fiesta Chat - Multi-Model AI Chat",
        template: "%s | AI Fiesta Chat"
    },
    description: "Chat with multiple AI models simultaneously. Get answers from GPT-4o Mini, Groq Llama, and Perplexity in one place.",
    keywords: ["AI Chat", "GPT-4", "Groq", "Perplexity", "Multi-model", "Artificial Intelligence"],
    openGraph: {
        title: "AI Fiesta Chat",
        description: "The ultimate multi-model AI chat experience.",
        url: "https://ashishgenai.online",
        siteName: "AI Fiesta Chat",
        locale: "en_US",
        type: "website",
    },
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
