import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
const pdf = require("pdf-parse");

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        try {
            const data = await pdf(buffer);
            return NextResponse.json({ text: data.text });
        } catch (error) {
            console.error("PDF parsing error:", error);
            return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
        }
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
