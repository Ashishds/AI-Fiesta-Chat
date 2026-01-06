import { NextRequest, NextResponse } from "next/server";

// @ts-ignore
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Convert Buffer to Uint8Array/ArrayBuffer for pdfjs
        const data = new Uint8Array(buffer);

        try {
            // Disable worker for Node.js environment
            // @ts-ignore
            pdfjsLib.GlobalWorkerOptions.workerSrc = false;

            const loadingTask = pdfjsLib.getDocument({ data });
            const pdfDocument = await loadingTask.promise;

            let extractedText = "";
            const numPages = pdfDocument.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                extractedText += pageText + "\n";
            }

            return NextResponse.json({ text: extractedText });
        } catch (error) {
            console.error("PDF parsing error:", error);
            // Enhanced error message
            return NextResponse.json({ error: error instanceof Error ? `Parser Error: ${error.message}` : "Failed to parse PDF structure" }, { status: 500 });
        }
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
    }
}
