import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
const pdf = require("pdf-parse");

// Force Node.js runtime (critical for pdf-parse which uses fs/buffer)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Basic size check (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (Max 5MB)" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        try {
            const data = await pdf(buffer);
            return NextResponse.json({ text: data.text });
        } catch (error) {
            console.error("PDF parsing error:", error);
            return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to parse PDF" }, { status: 500 });
        }
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
