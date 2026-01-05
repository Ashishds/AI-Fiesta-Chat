"use client";

import { Search, Plus, Sparkles, ChevronLeft, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UpgradeModal } from "./UpgradeModal";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";

interface SidebarProps {
    onNewChat: () => void;
    messages: Array<{ id: string; text: string; timestamp: number }>;
}

export default function Sidebar({ onNewChat, messages }: SidebarProps) {
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const chatHistory = messages.slice(-5).reverse();

    const userName = user?.firstName || user?.username || "Guest";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <>
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
            <div className="w-60 bg-card border-r border-border flex flex-col h-full">
                {/* Logo */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-semibold text-lg text-secondary-foreground">
                            AI Fiesta Chat
                        </span>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>

                {/* New Chat Button */}
                <div className="p-3 border-b border-border">
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New chat
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-3">
                    {chatHistory.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-secondary mb-2">Today</h3>
                            <div className="space-y-1">
                                {chatHistory.map((msg) => (
                                    <button
                                        key={msg.id}
                                        className="w-full text-left px-3 py-2 text-sm text-secondary-foreground hover:bg-background rounded-lg transition-colors truncate"
                                    >
                                        {msg.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border p-3 space-y-3">
                    {/* Plan Info */}
                    <div className="bg-background rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-secondary-foreground">Free Plan</span>
                        </div>
                        <p className="text-xs text-secondary mb-2">
                            {messages.length}/10 messages used
                        </p>
                        <button
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                        >
                            <Sparkles className="w-3 h-3" />
                            Upgrade plan
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {userInitial}
                            </div>
                            <span className="flex-1 text-sm font-medium text-secondary-foreground text-left">
                                {userName}
                            </span>
                            <ChevronLeft className={cn(
                                "w-4 h-4 text-secondary transition-transform duration-200",
                                isUserMenuOpen ? "-rotate-90" : "rotate-180"
                            )} />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                                {isSignedIn ? (
                                    <>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-secondary-foreground hover:bg-background transition-colors">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-secondary-foreground hover:bg-background transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                        <div className="border-t border-border" />
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <SignInButton mode="modal">
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors">
                                            <User className="w-4 h-4" />
                                            Sign in to save chats
                                        </button>
                                    </SignInButton>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

