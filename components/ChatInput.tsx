import { useState, useRef } from "react";
import { Send, Plus, Mic, X, Image as ImageIcon } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (text: string, images?: string[]) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() || selectedImages.length > 0) {
            onSendMessage(input.trim(), selectedImages.length > 0 ? selectedImages : undefined);
            setInput("");
            setSelectedImages([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            // Limit to 3 images max for now
            const newFiles = files.slice(0, 3 - selectedImages.length);

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                        setSelectedImages(prev => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });

            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="border-t border-border bg-card px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
            {/* Image Preview Area */}
            {selectedImages.length > 0 && (
                <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
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
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                />

                {/* Plus Button (Triggers File Input) */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-secondary hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-200"
                    title="Upload Image"
                >
                    <Plus className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedImages.length > 0 ? "Ask a question about these images..." : "Ask me anything..."}
                        rows={1}
                        className="w-full resize-none px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 max-h-32 min-h-[42px]"
                    />
                </div>

                {/* Microphone Button */}
                <button
                    type="button"
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-secondary hover:text-secondary-foreground hover:bg-background rounded-lg transition-colors"
                >
                    <Mic className="w-5 h-5" />
                </button>

                {/* Send Button (only when text or images are entered) */}
                {(input.trim() || selectedImages.length > 0) && (
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
