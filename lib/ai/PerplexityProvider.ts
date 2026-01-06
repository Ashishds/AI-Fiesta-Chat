import { AIProvider, AIResponse } from "./BaseProvider";

export class PerplexityProvider implements AIProvider {
    name: string;
    icon: string;
    private model: string;

    constructor(name: string, icon: string, model: string = "sonar") {
        this.name = name;
        this.icon = icon;
        this.model = model;
    }

    async sendMessage(prompt: string, images?: string[]): Promise<AIResponse> {
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            return {
                text: "",
                model: this.name,
                timestamp: Date.now(),
                error: "Perplexity API key not configured",
            };
        }

        try {
            const response = await fetch("https://api.perplexity.ai/chat/completions", {
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
                throw new Error(error.error?.message || "Perplexity API error");
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
