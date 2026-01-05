"use client";

import { useState } from "react";
import { Send, Plus, Mic } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="border-t border-border bg-card px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
                {/* Plus Button */}
                <button
                    type="button"
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-secondary hover:text-secondary-foreground hover:bg-background rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        rows={1}
                        className="w-full resize-none px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 max-h-32"
                        style={{ minHeight: "42px" }}
                    />
                </div>

                {/* Microphone Button */}
                <button
                    type="button"
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-secondary hover:text-secondary-foreground hover:bg-background rounded-lg transition-colors"
                >
                    <Mic className="w-5 h-5" />
                </button>

                {/* Send Button (only when text is entered) */}
                {input.trim() && (
                    <button
                        type="submit"
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                )}
            </form>
        </div>
    );
}
