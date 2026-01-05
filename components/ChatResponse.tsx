"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, ThumbsUp, ThumbsDown, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatResponseProps {
    text: string;
    modelName: string;
    isLoading?: boolean;
    error?: string;
}

export default function ChatResponse({ text, modelName, isLoading, error }: ChatResponseProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [copied, setCopied] = useState(false);

    // Typewriter effect state
    const indexRef = useRef(0);
    const textRef = useRef(text);

    // Update the ref when prop changes
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        // If loading and no text, reset
        if (isLoading && !text) {
            setDisplayedText("");
            indexRef.current = 0;
            return;
        }

        // If error, show immediately
        if (error) {
            setDisplayedText("");
            return;
        }

        const interval = setInterval(() => {
            const currentLength = indexRef.current;
            const targetText = textRef.current;

            if (currentLength < targetText.length) {
                // Determine chunk size based on remaining length to keep it snappy but visible
                // If far behind, type faster. If close, type slower (single char).
                const remaining = targetText.length - currentLength;
                const chunkSize = remaining > 50 ? 5 : remaining > 20 ? 3 : 1;

                setDisplayedText(targetText.slice(0, currentLength + chunkSize));
                indexRef.current += chunkSize;
            } else {
                // Ensure exact match at the end
                if (displayedText !== targetText) {
                    setDisplayedText(targetText);
                }
            }
        }, 10); // 10ms update rate = smooth 60fps-ish typing

        return () => clearInterval(interval);
    }, [text, isLoading, error, displayedText]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${modelName}-response.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading && !displayedText) {
        return (
            <div className="flex items-center gap-2 text-secondary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-2">
                <div className="text-sm text-secondary-foreground leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {displayedText + (isLoading && displayedText.length < text.length ? "▋" : "")}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Action Buttons - Only show when some text is generated */}
            {displayedText && (
                <div className="flex items-center gap-1">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className="p-1.5 text-secondary hover:text-secondary-foreground hover:bg-background rounded-md transition-colors"
                        title="Copy"
                    >
                        <Copy className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 text-secondary hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Like"
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 text-secondary hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Dislike"
                    >
                        <ThumbsDown className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="p-1.5 text-secondary hover:text-secondary-foreground hover:bg-background rounded-md transition-colors"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </motion.button>

                    {copied && (
                        <span className="text-xs text-green-600 ml-2">Copied!</span>
                    )}
                </div>
            )}
        </div>
    );
}
