"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { MODEL_LOGOS } from "./ModelLogos";
import ChatResponse from "./ChatResponse";

interface ChatColumnProps {
    model: {
        id: string;
        name: string;
        icon: string;
        provider: string;
    };
    messages: Array<{ id: string; text: string; images?: string[]; timestamp: number }>;
    responses: Array<{
        text: string;
        timestamp: number;
        isLoading?: boolean;
        error?: string;
    }>;
}

export default function ChatColumn({ model, messages, responses }: ChatColumnProps) {
    const [isEnabled, setIsEnabled] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleDownload = (text: string) => {
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${model.name}-response.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Get the logo component for this model
    const LogoComponent = MODEL_LOGOS[model.id];

    return (
        <div className="w-[380px] h-full bg-card border border-border rounded-xl shadow-sm flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2 flex-1">
                    {LogoComponent ? (
                        <LogoComponent className="w-6 h-6" />
                    ) : (
                        <span className="text-xl">{model.icon}</span>
                    )}
                    <button className="flex items-center gap-1 text-sm font-semibold text-secondary-foreground hover:bg-background px-2 py-1 rounded-md transition-colors">
                        {model.name}
                        <ChevronDown className="w-4 h-4 text-secondary" />
                    </button>
                </div>
                <ToggleSwitch enabled={isEnabled} onChange={setIsEnabled} />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, msgIndex) => (
                    <div key={msg.id}>
                        {/* User Message */}
                        <div className="mb-3">
                            <div className="flex flex-col items-end gap-2">
                                {msg.images && msg.images.length > 0 && (
                                    <div className="flex gap-2">
                                        {msg.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt="User upload"
                                                className="w-32 h-32 object-cover rounded-lg border border-border"
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className="bg-background rounded-lg px-4 py-2.5">
                                    <p className="text-sm text-secondary-foreground">{msg.text}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Response */}
                        {responses[msgIndex] && (
                            <ChatResponse
                                text={responses[msgIndex].text}
                                modelName={model.name}
                                isLoading={responses[msgIndex].isLoading}
                                error={responses[msgIndex].error}
                            />
                        )}
                    </div>
                ))}

                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-secondary text-sm">
                        Start a conversation to see {model.name} responses
                    </div>
                )}
            </div>
        </div>
    );
}
