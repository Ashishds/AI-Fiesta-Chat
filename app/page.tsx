"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import LandingPage from "@/components/LandingPage";

export default function HomePage() {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/chat");
        }
    }, [isLoaded, isSignedIn, router]);

    // Show landing page while checking auth or if signed out
    return <LandingPage />;
}
