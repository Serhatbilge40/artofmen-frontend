import { NextResponse } from 'next/server';
import { supabase, Product } from '@/lib/supabase';

// GET /api/products - List all products
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (published === 'true') {
            query = query.eq('published', true);
        } else if (published === 'false') {
            query = query.eq('published', false);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        // Transform to include _id for admin panel compatibility
        const products = data?.map(p => ({
            ...p,
            _id: p.id,
            colorScheme: p.color_scheme,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
        })) || [];

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, story, images, videos, category, tags, template, colorScheme, published } = body;

        if (!name || !description || !story) {
            return NextResponse.json(
                { error: 'Name, description, and story are required' },
                { status: 400 }
            );
        }

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[äöüß]/g, (match: string) => {
                const replacements: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
                return replacements[match] || match;
            })
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { data, error } = await supabase
            .from('products')
            .insert({
                slug,
                name,
                description,
                story,
                images: images || [],
                videos: videos || [],
                category: category || 'Uncategorized',
                tags: tags || [],
                template: template || 'modern',
                color_scheme: colorScheme || 'dark',
                published: published || false,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating product:', error);
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Ein Produkt mit diesem Namen existiert bereits' }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        // Return with _id for admin panel compatibility
        const product = {
            ...data,
            _id: data.id,
            colorScheme: data.color_scheme,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
