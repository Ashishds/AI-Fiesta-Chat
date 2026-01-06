"use client";

import { motion } from "framer-motion";
import ChatColumn from "./ChatColumn";

interface ChatContainerProps {
    messages: Array<{ id: string; text: string; images?: string[]; timestamp: number }>;
    responses: Record<string, Array<{
        text: string;
        timestamp: number;
        isLoading?: boolean;
        error?: string;
    }>>;
}

const MODELS = [
    { id: "gpt-4o-mini", name: "GPT-4o Mini", icon: "🤖", provider: "OpenAI" },
    { id: "groq", name: "Groq Llama", icon: "⚡", provider: "Groq" },
    { id: "perplexity", name: "Perplexity", icon: "🔮", provider: "Perplexity" },
];

export default function ChatContainer({ messages, responses }: ChatContainerProps) {
    return (
        <div className="h-full overflow-x-auto overflow-y-hidden bg-background p-6">
            <div className="flex gap-4 h-full min-w-max">
                {MODELS.map((model, index) => (
                    <motion.div
                        key={model.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <ChatColumn
                            model={model}
                            messages={messages}
                            responses={responses[model.id] || []}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
