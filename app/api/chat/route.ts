import { NextRequest, NextResponse } from "next/server";
import { OpenAIProvider } from "@/lib/ai/OpenAIProvider";
import { GroqProvider } from "@/lib/ai/GroqProvider";
import { PerplexityProvider } from "@/lib/ai/PerplexityProvider";

// Initialize AI providers - using free APIs
const providers = {
    "gpt-4o-mini": new OpenAIProvider("GPT-4o Mini", "🤖", "gpt-4o-mini"),
    "groq": new GroqProvider("Groq Llama", "⚡", "llama-3.3-70b-versatile"),
    "perplexity": new PerplexityProvider("Perplexity", "🔮", "sonar"),
};

export async function POST(request: NextRequest) {
    try {
        const { message, models } = await request.json();

        if (!message || !models || !Array.isArray(models)) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Send message to all requested models in parallel
        const responsePromises = models.map(async (modelId: string) => {
            const provider = providers[modelId as keyof typeof providers];

            if (!provider) {
                return {
                    model: modelId,
                    text: "",
                    timestamp: Date.now(),
                    error: `Model ${modelId} not found`,
                };
            }

            try {
                const response = await provider.sendMessage(message);
                return {
                    ...response,
                    model: modelId,
                };
            } catch (error) {
                return {
                    model: modelId,
                    text: "",
                    timestamp: Date.now(),
                    error: error instanceof Error ? error.message : "Unknown error occurred",
                };
            }
        });

        const responses = await Promise.all(responsePromises);

        return NextResponse.json({ responses });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
