import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envCheck = {
        NODE_ENV: process.env.NODE_ENV,
        CLERK_SECRET_KEY_EXISTS: !!process.env.CLERK_SECRET_KEY,
        CLERK_SECRET_KEY_LENGTH: process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.length : 0,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        Timestamp: new Date().toISOString(),
    };

    console.log('--- ENV CHECK ---', envCheck);

    return NextResponse.json(envCheck);
}
