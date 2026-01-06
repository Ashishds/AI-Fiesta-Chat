"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus, Mic, X, Image as ImageIcon, FileText, Loader2, MicOff } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (text: string, images?: string[]) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [attachedContext, setAttachedContext] = useState<{ name: string; content: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null); // SpeechRecognition instance

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                    let transcript = "";
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            transcript += event.results[i][0].transcript;
                        }
                    }
                    if (transcript) {
                        setInput((prev) => prev + (prev && !prev.endsWith(" ") ? " " : "") + transcript);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                    if (event.error === 'not-allowed') {
                        alert("Microphone access denied. Please allow microphone access in your browser settings.");
                    } else if (event.error === 'no-speech') {
                        // Ignore no-speech error
                    } else {
                        alert(`Voice Error: ${event.error}`);
                    }
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Failed to start speech recognition:", err);
                alert("Failed to start microphone. Please check permissions.");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isUploading) return;

        let finalMessage = input.trim();

        // Append attached document content to the message
        if (attachedContext) {
            finalMessage = `${finalMessage}\n\n---\n**Attached Document (${attachedContext.name}):**\n${attachedContext.content}\n---`;
        }

        if (finalMessage || selectedImages.length > 0) {
            onSendMessage(finalMessage, selectedImages.length > 0 ? selectedImages : undefined);
            setInput("");
            setSelectedImages([]);
            setAttachedContext(null);
            if (isListening) {
                recognitionRef.current?.stop();
                setIsListening(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const isImage = file.type.startsWith("image/");
            const isPdf = file.type === "application/pdf";
            const isText = file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".json") || file.name.endsWith(".txt");

            if (isImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                        setSelectedImages(prev => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            } else if (isPdf) {
                setIsUploading(true);
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const res = await fetch("/api/parse-pdf", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || "Parsing failed");
                    }

                    if (data.text) {
                        setAttachedContext({ name: file.name, content: data.text });
                    } else {
                        throw new Error("No text extracted from PDF");
                    }
                } catch (error) {
                    console.error("PDF upload failed", error);
                    alert(`Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
                } finally {
                    setIsUploading(false);
                }
            } else if (isText) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target?.result as string;
                    if (text) {
                        setAttachedContext({ name: file.name, content: text });
                    }
                };
                reader.readAsText(file);
            } else {
                alert("Unsupported file type. Please upload Images, PDFs, or Text files.");
            }

            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeContext = () => {
        setAttachedContext(null);
    };

    return (
        <div className="border-t border-border bg-card px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
            {/* Preview Area (Images & Docs) */}
            {(selectedImages.length > 0 || attachedContext || isUploading) && (
                <div className="flex gap-3 mb-3 overflow-x-auto pb-2 items-start">
                    {/* Images */}
                    {selectedImages.map((img, index) => (
                        <div key={index} className="relative group flex-shrink-0">
                            <img
                                src={img}
                                alt={`Selected ${index}`}
                                className="h-20 w-20 object-cover rounded-lg border border-border shadow-sm"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Document Badge */}
                    {attachedContext && (
                        <div className="relative group flex-shrink-0 h-20 w-32 bg-purple-50 border border-purple-200 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                            <FileText className="w-8 h-8 text-purple-600 mb-1" />
                            <span className="text-xs text-purple-900 font-medium truncate w-full px-1" title={attachedContext.name}>
                                {attachedContext.name}
                            </span>
                            <button
                                onClick={removeContext}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Loading Spinner */}
                    {isUploading && (
                        <div className="h-20 w-32 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-border">
                            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mb-1" />
                            <span className="text-xs text-secondary-foreground">Parsing PDF...</span>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,application/pdf,text/plain,.md,.json,.txt"
                    className="hidden"
                />

                {/* Plus Button (Triggers File Input) */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-secondary hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload Image or Document"
                >
                    <Plus className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isListening ? "Listening..." :
                                isUploading ? "Uploading document..." :
                                    attachedContext ? "Ask questions about the document..." :
                                        selectedImages.length > 0 ? "Ask a question about these images..." :
                                            "Ask me anything..."
                        }
                        rows={1}
                        className={`w-full resize-none px-4 py-2.5 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 max-h-32 min-h-[42px] transition-all
                            ${isListening ? "border-red-500 ring-2 ring-red-500/20" : "border-border"}`}
                    />
                </div>

                {/* Microphone Button */}
                <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-all
                        ${isListening
                            ? "text-white bg-red-500 hover:bg-red-600 shadow-md animate-pulse"
                            : "text-secondary hover:text-secondary-foreground hover:bg-background"
                        }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Send Button (only when text or attachments are entered) */}
                {(input.trim() || selectedImages.length > 0 || attachedContext) && !isUploading && (
                    <button
                        type="submit"
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                )}
            </form>
        </div>
    );
}
