import { AIProvider, AIResponse } from "./BaseProvider";

export class GeminiProvider implements AIProvider {
    name: string;
    icon: string;
    private model: string;

    constructor(name: string, icon: string, model: string = "gemini-2.0-flash-exp") {
        this.name = name;
        this.icon = icon;
        this.model = model;
    }

    async sendMessage(prompt: string): Promise<AIResponse> {
        // Read API key at request time, not module load time
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                text: "",
                model: this.name,
                timestamp: Date.now(),
                error: "Gemini API key not configured",
            };
        }

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            maxOutputTokens: 500,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "Gemini API error");
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

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
