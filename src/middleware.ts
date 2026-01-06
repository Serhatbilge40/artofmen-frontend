import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CORS headers for API routes
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return NextResponse.json({}, { headers: corsHeaders });
    }

    // Add CORS headers to all API responses
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const response = NextResponse.next();

        Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
