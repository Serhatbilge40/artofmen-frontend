import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/products/[id] - Get a single product by ID or slug
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Try to find by UUID first, then by slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let query = supabase.from('products').select('*');

        if (isUUID) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { data, error } = await query.single();

        if (error || !data) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders });
        }

        // Transform to match frontend expectations
        const product = {
            ...data,
            _id: data.id,
            colorScheme: data.color_scheme,
            qrCodeUrl: data.qr_code_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };

        return NextResponse.json(product, { headers: corsHeaders });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { name, slug, description, story, images, videos, category, tags, template, colorScheme, published, hotspots } = body;

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (description !== undefined) updateData.description = description;
        if (story !== undefined) updateData.story = story;
        if (images !== undefined) updateData.images = images;
        if (videos !== undefined) updateData.videos = videos;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;
        if (template !== undefined) updateData.template = template;
        if (colorScheme !== undefined) updateData.color_scheme = colorScheme;
        if (published !== undefined) updateData.published = published;
        if (hotspots !== undefined) updateData.hotspots = hotspots;

        // Try to find by UUID first, then by slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let query = supabase.from('products').update(updateData).select().single();

        if (isUUID) {
            query = supabase.from('products').update(updateData).eq('id', id).select().single();
        } else {
            query = supabase.from('products').update(updateData).eq('slug', id).select().single();
        }

        const { data, error } = await query;

        if (error || !data) {
            console.error('Error updating product:', error);
            return NextResponse.json({ error: 'Product not found or update failed' }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json(data, { headers: corsHeaders });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let query;
        if (isUUID) {
            query = supabase.from('products').delete().eq('id', id);
        } else {
            query = supabase.from('products').delete().eq('slug', id);
        }

        const { error } = await query;

        if (error) {
            console.error('Error deleting product:', error);
            return NextResponse.json({ error: 'Failed to delete product' }, { status: 500, headers: corsHeaders });
        }

        return NextResponse.json({ message: 'Product deleted successfully' }, { headers: corsHeaders });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
    }
}
