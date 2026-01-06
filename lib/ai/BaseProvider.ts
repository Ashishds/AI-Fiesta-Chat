export interface AIProvider {
    name: string;
    icon: string;
    sendMessage(prompt: string, images?: string[]): Promise<AIResponse>;
}

export interface AIResponse {
    text: string;
    model: string;
    timestamp: number;
    error?: string;
}
