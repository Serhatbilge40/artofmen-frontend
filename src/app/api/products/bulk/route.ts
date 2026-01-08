import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

type BulkAction = 'publish' | 'unpublish' | 'delete';

interface BulkRequest {
    ids: string[];
    action: BulkAction;
}

// POST /api/products/bulk - Bulk actions on products
export async function POST(request: Request) {
    try {
        const body: BulkRequest = await request.json();
        const { ids, action } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: 'No product IDs provided' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!action || !['publish', 'unpublish', 'delete'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Use: publish, unpublish, or delete' },
                { status: 400, headers: corsHeaders }
            );
        }

        let result;
        let affectedCount = 0;

        switch (action) {
            case 'publish':
                result = await supabase
                    .from('products')
                    .update({ published: true })
                    .in('id', ids);
                affectedCount = ids.length;
                break;

            case 'unpublish':
                result = await supabase
                    .from('products')
                    .update({ published: false })
                    .in('id', ids);
                affectedCount = ids.length;
                break;

            case 'delete':
                result = await supabase
                    .from('products')
                    .delete()
                    .in('id', ids);
                affectedCount = ids.length;
                break;
        }

        if (result?.error) {
            console.error('Bulk action error:', result.error);
            return NextResponse.json(
                { error: result.error.message },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json({
            success: true,
            action,
            affected: affectedCount,
            message: `${affectedCount} Produkt(e) ${action === 'publish' ? 'veröffentlicht' :
                    action === 'unpublish' ? 'als Entwurf gespeichert' :
                        'gelöscht'
                }`,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Bulk action error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Bulk action failed' },
            { status: 500, headers: corsHeaders }
        );
    }
}
