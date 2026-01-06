import { AIProvider, AIResponse } from "./BaseProvider";

export class GroqProvider implements AIProvider {
    name: string;
    icon: string;
    private model: string;

    constructor(name: string, icon: string, model: string = "llama-3.3-70b-versatile") {
        this.name = name;
        this.icon = icon;
        this.model = model;
    }

    async sendMessage(prompt: string, images?: string[]): Promise<AIResponse> {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                text: "",
                model: this.name,
                timestamp: Date.now(),
                error: "Groq API key not configured",
            };
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    max_tokens: 500,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "Groq API error");
            }

            const data = await response.json();
            const text = data.choices[0]?.message?.content || "No response";

            return {
                text,
                model: this.name,
                timestamp: Date.now(),
            };
        } catch (error) {
            return {
                text: "",
                model: this.name,
                timestamp: Date.now(),
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
