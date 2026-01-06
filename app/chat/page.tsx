"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import TopBanner from "@/components/TopBanner";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";
import { SignInButton } from "@clerk/nextjs";

interface Message {
    id: string;
    text: string;
    images?: string[];
    timestamp: number;
}

interface ResponseItem {
    text: string;
    timestamp: number;
    isLoading?: boolean;
    error?: string;
}

type ResponsesState = Record<string, ResponseItem[]>;

export default function ChatPage() {
    const { isSignedIn } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [responses, setResponses] = useState<ResponsesState>({});
    const streamingTexts = useRef<Record<string, string>>({});

    const handleSendMessage = async (text: string, images?: string[]) => {
        const messageId = Date.now().toString();
        const newMessage: Message = {
            id: messageId,
            text,
            images,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, newMessage]);

        const enabledModels = ["gpt-4o-mini", "groq", "perplexity"];

        // Initialize loading state for all models
        streamingTexts.current = {};
        enabledModels.forEach((modelId) => {
            streamingTexts.current[modelId] = "";
        });

        setResponses((prev) => {
            const updated: ResponsesState = { ...prev };
            enabledModels.forEach((modelId) => {
                updated[modelId] = [
                    ...(prev[modelId] || []),
                    { text: "", timestamp: Date.now(), isLoading: true },
                ];
            });
            return updated;
        });

        try {
            const res = await fetch("/api/chat/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, images, models: enabledModels }),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const reader = res.body?.getReader();
            if (!reader) {
                throw new Error("No response body");
            }

            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    try {
                        const data = JSON.parse(line.slice(6));
                        const { model, chunk, done: isDone, error } = data;

                        if (error) {
                            // Handle error for this model
                            setResponses((prev) => {
                                const updated = { ...prev };
                                const modelResponses = [...(prev[model] || [])];
                                const lastIndex = modelResponses.length - 1;
                                if (lastIndex >= 0) {
                                    modelResponses[lastIndex] = {
                                        text: "",
                                        timestamp: Date.now(),
                                        isLoading: false,
                                        error,
                                    };
                                }
                                updated[model] = modelResponses;
                                return updated;
                            });
                        } else if (chunk) {
                            // Append chunk to streaming text
                            streamingTexts.current[model] = (streamingTexts.current[model] || "") + chunk;
                            const currentText = streamingTexts.current[model];

                            // Update the response with new text
                            setResponses((prev) => {
                                const updated = { ...prev };
                                const modelResponses = [...(prev[model] || [])];
                                const lastIndex = modelResponses.length - 1;
                                if (lastIndex >= 0) {
                                    modelResponses[lastIndex] = {
                                        text: currentText,
                                        timestamp: Date.now(),
                                        isLoading: true,
                                    };
                                }
                                updated[model] = modelResponses;
                                return updated;
                            });
                        }

                        if (isDone) {
                            // Mark this model as done
                            const finalText = streamingTexts.current[model] || "";
                            setResponses((prev) => {
                                const updated = { ...prev };
                                const modelResponses = [...(prev[model] || [])];
                                const lastIndex = modelResponses.length - 1;
                                if (lastIndex >= 0) {
                                    modelResponses[lastIndex] = {
                                        text: finalText,
                                        timestamp: Date.now(),
                                        isLoading: false,
                                    };
                                }
                                updated[model] = modelResponses;
                                return updated;
                            });
                        }
                    } catch {
                        // Skip malformed JSON
                    }
                }
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setResponses((prev) => {
                const updated: ResponsesState = { ...prev };
                enabledModels.forEach((modelId) => {
                    const modelResponses = prev[modelId] || [];
                    updated[modelId] = [
                        ...modelResponses.filter((r) => !r.isLoading),
                        {
                            text: "",
                            timestamp: Date.now(),
                            error: error instanceof Error ? error.message : "Request failed",
                        },
                    ];
                });
                return updated;
            });
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setResponses({});
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar onNewChat={handleNewChat} messages={messages} />

            <div className="flex-1 flex flex-col relative">
                {/* User Button or Sign In Button */}
                <div className="absolute top-4 right-4 z-50">
                    {isSignedIn ? (
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 ring-2 ring-purple-500/30 ring-offset-2 ring-offset-white"
                                }
                            }}
                        />
                    ) : (
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
                                Sign In
                            </button>
                        </SignInButton>
                    )}
                </div>

                <TopBanner />

                <div className="flex-1 overflow-hidden">
                    <ChatContainer messages={messages} responses={responses} />
                </div>

                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}
