import { NextRequest } from "next/server";

// Streaming API endpoint for real-time responses
export async function POST(request: NextRequest) {
    try {
        const { message, models } = await request.json();

        if (!message || !models || !Array.isArray(models)) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create a readable stream that sends SSE events
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                // Process each model in parallel but stream results as they come
                const streamPromises = models.map(async (modelId: string) => {
                    try {
                        await streamModelResponse(modelId, message, (chunk) => {
                            const event = `data: ${JSON.stringify({ model: modelId, chunk, done: false })}\n\n`;
                            controller.enqueue(encoder.encode(event));
                        });
                        // Send done signal for this model
                        const doneEvent = `data: ${JSON.stringify({ model: modelId, chunk: "", done: true })}\n\n`;
                        controller.enqueue(encoder.encode(doneEvent));
                    } catch (error) {
                        const errorEvent = `data: ${JSON.stringify({
                            model: modelId,
                            error: error instanceof Error ? error.message : "Unknown error",
                            done: true
                        })}\n\n`;
                        controller.enqueue(encoder.encode(errorEvent));
                    }
                });

                await Promise.all(streamPromises);
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("API error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// Stream response from a specific model
async function streamModelResponse(
    modelId: string,
    message: string,
    onChunk: (chunk: string) => void
): Promise<void> {
    const apiConfigs: Record<string, { url: string; apiKey: string | undefined; model: string; isPerplexity?: boolean }> = {
        "gpt-4o-mini": {
            url: "https://api.openai.com/v1/chat/completions",
            apiKey: process.env.OPENAI_API_KEY,
            model: "gpt-4o-mini",
        },
        "groq": {
            url: "https://api.groq.com/openai/v1/chat/completions",
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.3-70b-versatile",
        },
        "perplexity": {
            url: "https://api.perplexity.ai/chat/completions",
            apiKey: process.env.PERPLEXITY_API_KEY,
            model: "sonar",
            isPerplexity: true,
        },
    };

    const config = apiConfigs[modelId];
    if (!config) {
        throw new Error(`Model ${modelId} not found`);
    }

    if (!config.apiKey) {
        throw new Error(`API key not configured for ${modelId}`);
    }

    const response = await fetch(config.url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: "user", content: message }],
            max_tokens: 1000,
            stream: true,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === "data: [DONE]") continue;

            if (trimmedLine.startsWith("data: ")) {
                try {
                    const json = JSON.parse(trimmedLine.slice(6));
                    const content = json.choices?.[0]?.delta?.content;
                    if (content) {
                        onChunk(content);
                    }
                } catch {
                    // Skip malformed JSON
                }
            }
        }
    }
}
