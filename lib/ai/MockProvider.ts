import { AIProvider, AIResponse } from "./BaseProvider";

const MOCK_RESPONSES = [
    "I understand your question. Let me provide a detailed answer based on the information available.",
    "That's an interesting topic! Here's what I can tell you about it.",
    "Based on my knowledge, I can explain this concept to you.",
    "Great question! Let me break this down for you step by step.",
    "I'd be happy to help with that. Here's a comprehensive explanation.",
];

const MOCK_DETAILS = [
    "This involves several key factors that work together to create the overall picture.",
    "There are multiple perspectives to consider when thinking about this topic.",
    "The fundamental principles behind this are quite fascinating when you dive deeper.",
    "Historical context shows us how this has evolved over time.",
    "Current research suggests several interesting developments in this area.",
];

export class MockProvider implements AIProvider {
    name: string;
    icon: string;

    constructor(name: string, icon: string) {
        this.name = name;
        this.icon = icon;
    }

    async sendMessage(prompt: string): Promise<AIResponse> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Generate mock response
        const intro = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
        const detail = MOCK_DETAILS[Math.floor(Math.random() * MOCK_DETAILS.length)];

        const text = `${intro}\n\n${detail}\n\nRegarding "${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}", the key points to understand are:\n\n1. First, consider the context and background\n2. Second, analyze the main components\n3. Finally, understand how they interconnect\n\nI hope this explanation helps clarify things for you!`;

        return {
            text,
            model: this.name,
            timestamp: Date.now(),
        };
    }
}
