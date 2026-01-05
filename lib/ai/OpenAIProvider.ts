import { AIProvider, AIResponse } from "./BaseProvider";

export class OpenAIProvider implements AIProvider {
    name: string;
    icon: string;
    private model: string;

    constructor(name: string, icon: string, model: string = "gpt-4") {
        this.name = name;
        this.icon = icon;
        this.model = model;
    }

    async sendMessage(prompt: string): Promise<AIResponse> {
        // Read API key at request time, not module load time
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return {
                text: "",
                model: this.name,
                timestamp: Date.now(),
                error: "OpenAI API key not configured",
            };
        }

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                throw new Error(error.error?.message || "OpenAI API error");
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
