"use client";

import { PartyPopper } from "lucide-react";

export default function TopBanner() {
    return (
        <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-5 border-b border-purple-800">
            <div className="flex items-start gap-3">
                <PartyPopper className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                <div>
                    <h2 className="text-white font-semibold text-lg mb-0.5">
                        Happy New Year 2026!
                    </h2>
                    <p className="text-purple-100 text-sm">
                        Ring in the new year with AI-powered conversations across multiple models!
                    </p>
                </div>
            </div>
        </div>
    );
}
