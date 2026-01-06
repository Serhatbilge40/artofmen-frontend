import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for the database
export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    story: string;
    images: string[];
    videos: string[];
    category: string;
    tags: string[];
    qr_code_url: string | null;
    published: boolean;
    template: 'classic' | 'modern' | 'minimal';
    color_scheme: 'dark' | 'light' | 'warm';
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'editor';
    created_at: string;
    updated_at: string;
}
