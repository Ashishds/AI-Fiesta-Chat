"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus, Mic, X, Image as ImageIcon, FileText, Loader2, MicOff, Globe, Search } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker (Load from CDN to avoid build/bundle issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ChatInputProps {
    onSendMessage: (text: string, images?: string[]) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [attachedContext, setAttachedContext] = useState<{ name: string; content: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showMenu, setShowMenu] = useState(false); // Controls the Plus Menu

    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null); // Separate input for docs
    const recognitionRef = useRef<any>(null);
    const menuRef = useRef<HTMLDivElement>(null); // To detect clicks outside

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
                recognition.onerror = (event: any) => { /* simplified error handling */ setIsListening(false); };
                recognition.onend = () => { setIsListening(false); };
                recognitionRef.current = recognition;
            }
        }
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
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
                console.error("Voice error:", err);
            }
        }
    };

    // --- CLIENT-SIDE PDF PARSING ---
    const parsePdfClientSide = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + "\n";
            }
            return fullText;
        } catch (error) {
            console.error("Client-side PDF parse error:", error);
            throw new Error("Failed to read PDF content.");
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'doc') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setShowMenu(false); // Close menu on selection

            if (type === 'image') {
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === "string") {
                            setSelectedImages(prev => [...prev, reader.result as string]);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert("Please select a valid image file.");
                }
            } else if (type === 'doc') {
                const isPdf = file.type === "application/pdf";
                const isText = file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".json") || file.name.endsWith(".txt");

                if (isPdf) {
                    setIsUploading(true);
                    try {
                        // Use Client-Side Parsing instead of API
                        const text = await parsePdfClientSide(file);
                        setAttachedContext({ name: file.name, content: text });
                    } catch (err) {
                        alert("Error reading PDF. Please try a different file.");
                    } finally {
                        setIsUploading(false);
                    }
                } else if (isText) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target?.result as string;
                        if (text) setAttachedContext({ name: file.name, content: text });
                    };
                    reader.readAsText(file);
                } else {
                    alert("Unsupported file. Please use PDF, TXT, MD, or JSON.");
                }
            }

            // Reset input
            if (e.target) e.target.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isUploading) return;
        let finalMessage = input.trim();
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

    return (
        <div className="bg-transparent pb-4">
            <div className="max-w-4xl mx-auto px-4">
                {/* Visual Previews (Images/Docs) - Kept same as before */}
                {(selectedImages.length > 0 || attachedContext || isUploading) && (
                    <div className="flex gap-3 mb-2 overflow-x-auto pb-2 items-start px-2">
                        {selectedImages.map((img, index) => (
                            <div key={index} className="relative group flex-shrink-0">
                                <img src={img} alt="Selected" className="h-20 w-20 object-cover rounded-lg border border-border shadow-sm" />
                                <button onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 shadow-md"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                        {attachedContext && (
                            <div className="relative group flex-shrink-0 h-20 w-32 bg-white/50 backdrop-blur-sm border border-purple-200 rounded-lg flex flex-col items-center justify-center p-2 text-center shadow-sm">
                                <FileText className="w-8 h-8 text-purple-600 mb-1" />
                                <span className="text-xs text-purple-900 font-medium truncate w-full px-1">{attachedContext.name}</span>
                                <button onClick={() => setAttachedContext(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"><X className="w-3 h-3" /></button>
                            </div>
                        )}
                        {isUploading && (
                            <div className="h-20 w-32 flex flex-col items-center justify-center bg-gray-50/80 rounded-lg border border-border"><Loader2 className="w-6 h-6 text-purple-600 animate-spin mb-1" /><span className="text-xs text-secondary-foreground">Reading PDF...</span></div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative z-20">
                    {/* Hidden Inputs */}
                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e, 'image')} accept="image/*" className="hidden" />
                    <input type="file" ref={docInputRef} onChange={(e) => handleFileSelect(e, 'doc')} accept=".pdf,.txt,.md,.json" className="hidden" />

                    {/* PLUS MENU POPUP */}
                    {showMenu && (
                        <div ref={menuRef} className="absolute bottom-16 left-0 mb-2 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-5">
                            <div className="p-2 space-y-1">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Attach Files</div>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-200">
                                    <ImageIcon className="w-4 h-4 text-green-500" />
                                    Image
                                </button>
                                <button type="button" onClick={() => docInputRef.current?.click()} className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-200">
                                    <FileText className="w-4 h-4 text-orange-500" />
                                    Document (PDF/Text)
                                </button>

                                <div className="my-1 border-t border-gray-100 dark:border-zinc-700"></div>

                                {/* Placeholder "Tools" to match Screenshot */}
                                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Generate / Tools</div>
                                <button type="button" className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-200 opacity-50 cursor-not-allowed" title="Coming Soon">
                                    <Globe className="w-4 h-4 text-blue-500" />
                                    Web Search
                                </button>
                                <button type="button" className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-200 opacity-50 cursor-not-allowed" title="Coming Soon">
                                    <Search className="w-4 h-4 text-purple-500" />
                                    Deep Research
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CAPSULE INPUT */}
                    <div className={`relative flex items-end gap-2 bg-white dark:bg-zinc-800 border shadow-lg rounded-[26px] pl-2 pr-2 py-2 transition-all duration-200 ease-in-out
                        ${isListening ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-200 dark:border-zinc-700 focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-500/10"}`}>

                        {/* THE PLUS BUTTON (Toggle Menu) */}
                        <button
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors mb-0.5
                                ${showMenu ? "bg-black text-white rotate-45" : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"}`}
                        >
                            <Plus className="w-5 h-5 transition-transform" />
                        </button>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                            placeholder={isUploading ? "Reading document..." : "Ask me anything..."}
                            rows={1}
                            className="w-full resize-none py-2 text-base bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 max-h-32 min-h-[44px]"
                            style={{ scrollbarWidth: 'none' }}
                        />

                        <div className="flex items-center gap-1 mb-0.5">
                            <button type="button" onClick={toggleListening} className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700"}`}>
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <button type="submit" disabled={!input.trim() && !attachedContext && selectedImages.length === 0} className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${input.trim() || attachedContext || selectedImages.length > 0 ? "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black" : "bg-gray-200 text-gray-400"}`}>
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-400">AI can make mistakes. Check important info.</p>
                </div>
            </div>
        </div>
    );
}
