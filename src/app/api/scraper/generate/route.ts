import { NextResponse } from 'next/server';
import OpenAI from 'openai';
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

interface ProductToGenerate {
    name: string;
    category: string;
    price?: string;
    sizes?: string;
    imageUrl?: string;
}

interface GeneratedContent {
    description: string;
    story: string;
}

async function generateWithOpenAI(product: ProductToGenerate): Promise<GeneratedContent> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not configured');
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `Produkt: ${product.name}
Kategorie: ${product.category}
${product.price ? `Preis: ${product.price}` : ''}

Erstelle für diesen Anzug:

1. DESCRIPTION (Produktbeschreibung):
   - 2 Sätze, die das PRODUKT selbst beschreiben
   - Farbe, Material, Schnitt, für welchen Anlass
   - Sachlich aber elegant

2. STORY (kurze emotionale Geschichte):
   - MAXIMAL 5 Sätze
   - BEGINNE NICHT mit dem Produktnamen
   - Beginne mit einer Szene oder einem Moment
   - Erzähle von Handwerk, Tradition oder dem Mann der ihn trägt
   - Sei kreativ und einzigartig - jede Geschichte soll anders sein

JSON Format:
{
  "description": "Sachliche Produktbeschreibung in 2 Sätzen.",
  "story": "<p>Geschichte in maximal 5 Sätzen. Beginne mit einer Szene.</p>"
}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'Du schreibst auf Deutsch. Sei kreativ - jede Geschichte soll einzigartig sein. Antworte nur im JSON Format.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: { type: 'json_object' },
        temperature: 1.0,
        max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    if (!parsed.description || !parsed.story || parsed.story.length < 200) {
        throw new Error('AI response too short or incomplete');
    }

    return {
        description: parsed.description,
        story: parsed.story,
    };
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[äöüß]/g, (match) => {
            const replacements: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
            return replacements[match] || match;
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 100);
}

// POST /api/scraper/generate - Generate AI descriptions and save products
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { products, saveToDatabase = false } = body as {
            products: ProductToGenerate[];
            saveToDatabase?: boolean;
        };

        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                { error: 'No products provided' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Process up to 50 products at a time
        const productsToProcess = products.slice(0, 50);
        const results = [];
        const errors = [];

        console.log(`Processing ${productsToProcess.length} products with OpenAI...`);

        for (let i = 0; i < productsToProcess.length; i++) {
            const product = productsToProcess[i];
            console.log(`[${i + 1}/${productsToProcess.length}] Processing: ${product.name}`);

            try {
                // Generate AI content with retry
                let generated: GeneratedContent | null = null;
                let retries = 3;
                let lastError: Error | null = null;

                while (retries > 0 && !generated) {
                    try {
                        generated = await generateWithOpenAI(product);
                    } catch (aiError) {
                        lastError = aiError as Error;
                        console.error(`OpenAI error for ${product.name}, retries left: ${retries - 1}`, aiError);
                        retries--;
                        if (retries > 0) {
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                }

                if (!generated) {
                    errors.push({
                        product: product.name,
                        error: lastError?.message || 'AI generation failed - check OPENAI_API_KEY',
                    });
                    continue;
                }

                const slug = generateSlug(product.name);
                const processedProduct = {
                    ...product,
                    slug,
                    description: generated.description,
                    story: generated.story,
                    images: product.imageUrl ? [product.imageUrl] : [],
                };

                if (saveToDatabase) {
                    console.log(`Saving to database: ${slug}`);

                    const { data, error } = await supabase
                        .from('products')
                        .upsert({
                            slug,
                            name: product.name,
                            description: generated.description,
                            story: generated.story,
                            images: processedProduct.images,
                            videos: [],
                            category: product.category || 'Kollektion',
                            tags: [],
                            published: false,
                            template: 'modern',
                            color_scheme: 'dark',
                        }, {
                            onConflict: 'slug',
                        })
                        .select()
                        .single();

                    if (error) {
                        console.error(`Database error for ${product.name}:`, error);
                        errors.push({
                            product: product.name,
                            error: `DB: ${error.message}`,
                        });
                    } else {
                        console.log(`Saved: ${product.name} with id ${data?.id}`);
                        results.push({
                            ...processedProduct,
                            saved: true,
                            id: data?.id,
                        });
                    }
                } else {
                    results.push({ ...processedProduct, saved: false });
                }

                // Delay between products
                if (i < productsToProcess.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (err) {
                console.error(`Error processing ${product.name}:`, err);
                errors.push({
                    product: product.name,
                    error: err instanceof Error ? err.message : 'Unknown error',
                });
            }
        }

        return NextResponse.json({
            success: true,
            generated: results.length,
            errors: errors.length,
            results,
            errorDetails: errors,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Generate error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Generation failed' },
            { status: 500, headers: corsHeaders }
        );
    }
}
