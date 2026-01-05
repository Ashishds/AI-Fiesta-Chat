"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Upgrade your plan</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    {/* Monthly Plan */}
                    <div className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all">
                        <div className="text-center mb-6">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-gray-900">₹999</span>
                                <span className="text-gray-500 text-sm">/month</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Monthly billing</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {[
                                "3,000,000 tokens/month",
                                "All latest & premium AI models included",
                                "Side-by-side comparison",
                                "Instant prompt enhancement",
                                "Image generation & Audio transcription",
                                "Ultimate PromptBook",
                                "Community Access",
                                "Free future AI Model upgrades"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
                            Get monthly plan
                        </button>
                    </div>

                    {/* Yearly Plan */}
                    <div className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all relative">
                        {/* Save Badge */}
                        <div className="absolute top-0 right-0 p-4">
                            {/* Badge styling if needed? The screenshot didn't strictly show an overlay badge, but let's keep it clean */}
                        </div>

                        <div className="text-center mb-6">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-gray-900">₹9,999</span>
                                <span className="text-gray-500 text-sm">/year</span>
                            </div>
                            <p className="text-sm text-green-600 font-medium mt-1">Save ₹1,989 /year</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {[
                                "36,000,000 tokens/year",
                                "All latest & premium AI models included",
                                "Side-by-side comparison",
                                "Instant prompt enhancement",
                                "Image generation & Audio transcription",
                                "Ultimate PromptBook",
                                "Community Access",
                                "Free future AI Model upgrades"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
                            Get yearly plan
                        </button>
                    </div>
                </div>

                <div className="p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                    By purchasing, you agree to our <a href="#" className="underline">Terms of Service</a>, <a href="#" className="underline">Privacy Policy</a>, and <a href="#" className="underline">Refund Policy</a>.
                </div>
            </div>
        </div>
    );
}
