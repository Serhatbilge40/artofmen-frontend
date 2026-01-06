import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'png';
        const size = parseInt(searchParams.get('size') || '300');
        const ecl = (searchParams.get('ecl') || 'M') as 'L' | 'M' | 'Q' | 'H';

        // Try to find by UUID first, then by slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let query = supabase.from('products').select('slug');
        if (isUUID) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { data, error } = await query.single();

        if (error || !data) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
        }

        // Determine the base URL for the QR code
        // Priority: NEXT_PUBLIC_APP_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL > request origin > localhost
        let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        
        if (!baseUrl && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
            baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
        } else if (!baseUrl && process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        } else if (!baseUrl) {
            // Try to get from request origin
            const origin = request.headers.get('origin');
            const referer = request.headers.get('referer');
            if (origin && !origin.includes('localhost')) {
                baseUrl = origin;
            } else if (referer && !referer.includes('localhost')) {
                const refererUrl = new URL(referer);
                baseUrl = refererUrl.origin;
            } else {
                baseUrl = 'http://localhost:3000';
            }
        }
        
        const productUrl = `${baseUrl}/product/${data.slug}`;

        const qrOptions = {
            errorCorrectionLevel: ecl,
            width: size,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        };

        if (format === 'svg') {
            const svgString = await QRCode.toString(productUrl, {
                ...qrOptions,
                type: 'svg',
            });

            return new NextResponse(svgString, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=31536000',
                    ...corsHeaders,
                },
            });
        } else {
            const pngBuffer = await QRCode.toBuffer(productUrl, {
                ...qrOptions,
                type: 'png',
            });

            return new NextResponse(new Uint8Array(pngBuffer), {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=31536000',
                    ...corsHeaders,
                },
            });
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}
